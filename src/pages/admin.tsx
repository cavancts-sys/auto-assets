import { useState, useRef, useCallback, useEffect } from "react";
import { resolveColour } from "../lib/colour-utils";
import { Link } from "wouter";
import { useInventory } from "../hooks/use-inventory";
import { type Car, formatPrice } from "../lib/data";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  LogOut, ArrowLeft, X, Image, Upload, ChevronUp, ChevronDown,
} from "lucide-react";

const ADMIN_PASSWORD = "autoassets2024";
const SESSION_KEY = "aa_admin_session";

const CROP_W = 360;
const CROP_H = 270;

type FormData = {
  make: string;
  model: string;
  year: string;
  price: string;
  wasPrice: string;
  mileage: string;
  serviceHistory: string;
  colour: string;
  bodyType: string;
  engine: string;
  transmission: string;
  fuelType: string;
  status: "available" | "sold";
  images: string[];
  autoTraderUrl: string;
};

const EMPTY_FORM: FormData = {
  make: "", model: "",
  year: new Date().getFullYear().toString(),
  price: "", wasPrice: "", mileage: "", serviceHistory: "",
  colour: "", bodyType: "", engine: "", transmission: "", fuelType: "",
  status: "available", images: [""], autoTraderUrl: "",
};

function carToForm(car: Car): FormData {
  return {
    make: car.make, model: car.model,
    year: car.year.toString(),
    price: car.price !== null ? car.price.toString() : "",
    wasPrice: car.wasPrice ? car.wasPrice.toString() : "",
    mileage: car.mileage, serviceHistory: car.serviceHistory,
    colour: car.colour, bodyType: car.bodyType, engine: car.engine,
    transmission: car.transmission, fuelType: car.fuelType,
    status: car.status,
    images: car.images.length > 0 ? car.images : [""],
    autoTraderUrl: car.autoTraderUrl || "",
  };
}

function formToCar(form: FormData): Omit<Car, "id"> {
  const parsedWas = form.wasPrice.trim()
    ? parseInt(form.wasPrice.replace(/\D/g, ""))
    : null;
  return {
    make: form.make.trim(), model: form.model.trim(),
    year: parseInt(form.year) || new Date().getFullYear(),
    price: form.price.trim() ? parseInt(form.price.replace(/\D/g, "")) : null,
    wasPrice: parsedWas,
    mileage: form.mileage.trim(), serviceHistory: form.serviceHistory.trim(),
    colour: form.colour.trim(), bodyType: form.bodyType.trim(),
    engine: form.engine.trim(), transmission: form.transmission.trim(),
    fuelType: form.fuelType.trim(), status: form.status,
    images: form.images.filter(u => u.trim() !== ""),
    autoTraderUrl: form.autoTraderUrl.trim() || undefined,
  };
}

function ImageCropper({
  file, maxWidth, quality,
  onConfirm, onCancel,
}: {
  file: File; maxWidth: number; quality: number;
  onConfirm: (dataUrl: string) => void;
  onCancel: () => void;
}) {
  const [imgSrc, setImgSrc] = useState("");
  const [naturalSize, setNaturalSize] = useState({ w: 0, h: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = e => setImgSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const scale = naturalSize.w > 0
    ? Math.max(CROP_W / naturalSize.w, CROP_H / naturalSize.h)
    : 1;
  const scaledW = naturalSize.w * scale;
  const scaledH = naturalSize.h * scale;

  const clamp = useCallback((x: number, y: number) => ({
    x: Math.min(0, Math.max(x, CROP_W - scaledW)),
    y: Math.min(0, Math.max(y, CROP_H - scaledH)),
  }), [scaledW, scaledH]);

  function handleImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const w = img.naturalWidth, h = img.naturalHeight;
    setNaturalSize({ w, h });
    const s = Math.max(CROP_W / w, CROP_H / h);
    const sw = w * s, sh = h * s;
    setPan({
      x: Math.min(0, Math.max((CROP_W - sw) / 2, CROP_W - sw)),
      y: Math.min(0, Math.max((CROP_H - sh) / 2, CROP_H - sh)),
    });
  }

  function startDrag(clientX: number, clientY: number) {
    isDragging.current = true;
    dragStart.current = { x: clientX, y: clientY, panX: pan.x, panY: pan.y };
  }
  function moveDrag(clientX: number, clientY: number) {
    if (!isDragging.current) return;
    const dx = clientX - dragStart.current.x;
    const dy = clientY - dragStart.current.y;
    setPan(clamp(dragStart.current.panX + dx, dragStart.current.panY + dy));
  }
  function endDrag() { isDragging.current = false; }

  async function confirm() {
    if (!imgSrc) return;
    const targetH = Math.round(maxWidth * (CROP_H / CROP_W));
    const canvas = document.createElement("canvas");
    canvas.width = maxWidth;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      const s = Math.max(CROP_W / img.naturalWidth, CROP_H / img.naturalHeight);
      const srcX = -pan.x / s;
      const srcY = -pan.y / s;
      const srcW = CROP_W / s;
      const srcH = CROP_H / s;
      ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, maxWidth, targetH);
      onConfirm(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = imgSrc;
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-bold text-lg">Crop Photo</h3>
            <p className="text-white/40 text-xs mt-0.5">Drag to reposition the image</p>
          </div>
          <button onClick={onCancel} className="p-2 text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Crop Box */}
        <div
          style={{ width: CROP_W, height: CROP_H }}
          className="relative overflow-hidden rounded-xl border-2 border-white/30 cursor-grab active:cursor-grabbing mx-auto bg-black select-none touch-none"
          onMouseDown={e => startDrag(e.clientX, e.clientY)}
          onMouseMove={e => moveDrag(e.clientX, e.clientY)}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={e => { const t = e.touches[0]; startDrag(t.clientX, t.clientY); }}
          onTouchMove={e => { const t = e.touches[0]; moveDrag(t.clientX, t.clientY); }}
          onTouchEnd={endDrag}
        >
          {imgSrc && (
            <img
              src={imgSrc}
              alt=""
              onLoad={handleImgLoad}
              style={{
                position: "absolute",
                left: pan.x,
                top: pan.y,
                width: scaledW || "auto",
                height: scaledH || "auto",
                pointerEvents: "none",
                userSelect: "none",
              }}
              draggable={false}
            />
          )}
          {!imgSrc && (
            <div className="w-full h-full flex items-center justify-center text-white/20 text-sm">
              Loading…
            </div>
          )}
          {/* Rule of thirds grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "120px 90px",
          }} />
        </div>

        <p className="text-center text-white/30 text-xs mt-3 mb-5">
          Output: {maxWidth} × {Math.round(maxWidth * CROP_H / CROP_W)}px
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!imgSrc || naturalSize.w === 0}
            className="flex-1 py-3 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-colors text-sm disabled:opacity-40"
          >
            Crop & Use
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageRow({
  value, onChange, onRemove, canRemove, maxWidth, quality,
}: {
  value: string; onChange: (v: string) => void;
  onRemove: () => void; canRemove: boolean;
  maxWidth: number; quality: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);

  const isDataUrl = value.startsWith("data:");

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCropFile(file);
    if (fileRef.current) fileRef.current.value = "";
  }

  function handleCropConfirm(dataUrl: string) {
    onChange(dataUrl);
    setCropFile(null);
  }

  return (
    <>
      {cropFile && (
        <ImageCropper
          file={cropFile}
          maxWidth={maxWidth}
          quality={quality}
          onConfirm={handleCropConfirm}
          onCancel={() => setCropFile(null)}
        />
      )}
      <div className="flex gap-2 items-start">
        <div className="flex-1 space-y-2">
          <div className="flex gap-2 items-center">
            <Image size={16} className="text-white/30 shrink-0 mt-3" />
            <input
              className="flex-1 bg-black border border-white/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/60 placeholder:text-white/30 transition-colors"
              value={isDataUrl ? "(uploaded & cropped)" : value}
              onChange={e => onChange(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              readOnly={isDataUrl}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              title="Upload from device"
              className="shrink-0 flex items-center gap-1.5 px-3 py-3 border border-white/20 text-white/60 hover:text-white hover:border-white/40 rounded-lg transition-colors text-xs"
            >
              <Upload size={15} />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <input
              ref={fileRef} type="file" accept="image/*"
              className="hidden" onChange={handleFile}
            />
          </div>
          {value.trim() && (
            <div className="ml-6 w-28 h-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
              <img src={value} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        {canRemove && (
          <button
            type="button" onClick={onRemove}
            className="p-2 mt-3 text-white/30 hover:text-red-400 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </>
  );
}

function CarForm({
  initial, onSave, onCancel,
}: {
  initial: FormData;
  onSave: (data: FormData) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [maxWidth, setMaxWidth] = useState(1280);
  const [quality, setQuality] = useState(0.82);

  function set(field: keyof FormData, value: string | string[]) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  function addImage() { setForm(prev => ({ ...prev, images: [...prev.images, ""] })); }
  function removeImage(i: number) { setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) })); }
  function setImage(i: number, val: string) {
    setForm(prev => { const next = [...prev.images]; next[i] = val; return { ...prev, images: next }; });
  }

  function validate() {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.make.trim()) e.make = "Required";
    if (!form.model.trim()) e.model = "Required";
    if (!form.year.trim() || isNaN(parseInt(form.year))) e.year = "Valid year required";
    if (!form.mileage.trim()) e.mileage = "Required";
    if (!form.colour.trim()) e.colour = "Required";
    if (form.images.filter(u => u.trim()).length === 0) e.images = "At least one image required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  const inputCls = "w-full bg-black border border-white/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/60 placeholder:text-white/30 transition-colors";
  const labelCls = "block text-xs uppercase tracking-widest text-white/50 mb-2 font-semibold";
  const errCls = "text-red-400 text-xs mt-1";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider font-display">
            {initial === EMPTY_FORM ? "Add New Car" : "Edit Car"}
          </h2>
          <button onClick={onCancel} className="p-2 text-white/50 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Make *</label>
                <input className={inputCls} value={form.make} onChange={e => set("make", e.target.value)} placeholder="e.g. Nissan" />
                {errors.make && <p className={errCls}>{errors.make}</p>}
              </div>
              <div>
                <label className={labelCls}>Model *</label>
                <input className={inputCls} value={form.model} onChange={e => set("model", e.target.value)} placeholder="e.g. GT-R" />
                {errors.model && <p className={errCls}>{errors.model}</p>}
              </div>
              <div>
                <label className={labelCls}>Year *</label>
                <input className={inputCls} value={form.year} onChange={e => set("year", e.target.value)} placeholder="e.g. 2020" type="number" min="1900" max="2030" />
                {errors.year && <p className={errCls}>{errors.year}</p>}
              </div>
              <div>
                <label className={labelCls}>Colour *</label>
                <div className="relative">
                  <div
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border border-white/30 transition-colors duration-200 pointer-events-none"
                    style={{ backgroundColor: resolveColour(form.colour) }}
                  />
                  <input
                    className={inputCls + " pl-10"}
                    value={form.colour}
                    onChange={e => set("colour", e.target.value)}
                    placeholder="e.g. Midnight Black"
                  />
                </div>
                {errors.colour && <p className={errCls}>{errors.colour}</p>}
              </div>
              <div>
                <label className={labelCls}>Price (ZAR) — blank = POA</label>
                <input className={inputCls} value={form.price} onChange={e => set("price", e.target.value)} placeholder="e.g. 359900" />
              </div>
              <div>
                <label className={labelCls}>Was Price (ZAR) — optional discount</label>
                <input className={inputCls} value={form.wasPrice} onChange={e => set("wasPrice", e.target.value)} placeholder="e.g. 399900" />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value as "available" | "sold")}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>AutoTrader Listing URL — optional</label>
                <input
                  className={inputCls}
                  value={form.autoTraderUrl}
                  onChange={e => set("autoTraderUrl", e.target.value)}
                  placeholder="https://www.autotrader.co.za/..."
                  type="url"
                />
                <p className="text-white/30 text-xs mt-1">Powers the "More Details" button on the listing page.</p>
              </div>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-6">Vehicle Specs</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Mileage *</label>
                <input className={inputCls} value={form.mileage} onChange={e => set("mileage", e.target.value)} placeholder="e.g. 89,760 km" />
                {errors.mileage && <p className={errCls}>{errors.mileage}</p>}
              </div>
              <div>
                <label className={labelCls}>Engine</label>
                <input className={inputCls} value={form.engine} onChange={e => set("engine", e.target.value)} placeholder="e.g. 3.8L Twin-Turbo V6" />
              </div>
              <div>
                <label className={labelCls}>Transmission</label>
                <input className={inputCls} value={form.transmission} onChange={e => set("transmission", e.target.value)} placeholder="e.g. Manual" />
              </div>
              <div>
                <label className={labelCls}>Fuel Type</label>
                <input className={inputCls} value={form.fuelType} onChange={e => set("fuelType", e.target.value)} placeholder="e.g. Petrol" />
              </div>
              <div>
                <label className={labelCls}>Body Type</label>
                <input className={inputCls} value={form.bodyType} onChange={e => set("bodyType", e.target.value)} placeholder="e.g. Coupe" />
              </div>
              <div>
                <label className={labelCls}>Service History</label>
                <input className={inputCls} value={form.serviceHistory} onChange={e => set("serviceHistory", e.target.value)} placeholder="e.g. Full Service History" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm mb-1">Photos</h3>
            <p className="text-white/40 text-xs mb-5">
              Click <strong className="text-white/60">Upload</strong> to pick a file — you'll be able to drag &amp; crop it. Or paste a URL directly.
            </p>

            {/* Compression settings */}
            <div className="flex flex-col sm:flex-row gap-5 mb-6 p-4 bg-black/30 rounded-lg border border-white/10">
              <div className="flex-1">
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Max width: <span className="text-white/70">{maxWidth}px</span>
                </label>
                <input type="range" min={640} max={1920} step={64} value={maxWidth}
                  onChange={e => setMaxWidth(Number(e.target.value))} className="w-full accent-white" />
                <div className="flex justify-between text-xs text-white/25 mt-1"><span>640</span><span>1920</span></div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">
                  Quality: <span className="text-white/70">{Math.round(quality * 100)}%</span>
                </label>
                <input type="range" min={0.5} max={1} step={0.05} value={quality}
                  onChange={e => setQuality(Number(e.target.value))} className="w-full accent-white" />
                <div className="flex justify-between text-xs text-white/25 mt-1"><span>50%</span><span>100%</span></div>
              </div>
            </div>

            {errors.images && <p className={errCls + " mb-3"}>{errors.images}</p>}
            <div className="space-y-4">
              {form.images.map((url, i) => (
                <ImageRow
                  key={i} value={url}
                  onChange={v => setImage(i, v)}
                  onRemove={() => removeImage(i)}
                  canRemove={form.images.length > 1}
                  maxWidth={maxWidth} quality={quality}
                />
              ))}
            </div>
            <button type="button" onClick={addImage}
              className="mt-5 flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
              <Plus size={16} /> Add another photo
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-2">
            <button type="button" onClick={onCancel}
              className="px-6 py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition-colors text-sm uppercase tracking-wider">
              Cancel
            </button>
            <button type="submit"
              className="px-8 py-3 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-colors text-sm uppercase tracking-wider">
              Save Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AdminPanel() {
  const { cars, addCar, updateCar, deleteCar, toggleStatus, moveUp, moveDown } = useInventory();
  const [formMode, setFormMode] = useState<"none" | "add" | "edit">("none");
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");
  const [saving, setSaving] = useState(false);

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    window.location.reload();
  }

  async function handleSave(data: FormData) {
    const carData = formToCar(data);
    setSaving(true);
    try {
      if (formMode === "add") await addCar(carData);
      else if (formMode === "edit" && editingCar) await updateCar(editingCar.id, carData);
    } finally {
      setSaving(false);
    }
    setFormMode("none");
    setEditingCar(null);
  }

  async function handleDelete(id: number) {
    if (deleteConfirm === id) { await deleteCar(id); setDeleteConfirm(null); }
    else setDeleteConfirm(id);
  }

  const displayed = filter === "all" ? cars : cars.filter(c => c.status === filter);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/"><img src={`${import.meta.env.BASE_URL}logo.png`} alt="Auto Assets" className="h-12 w-auto" /></Link>
            <div className="h-8 w-px bg-white/20" />
            <span className="text-sm font-bold uppercase tracking-widest text-white/60">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden sm:flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={16} /> View Site
            </Link>
            <button onClick={logout}
              className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg text-sm text-white/60 hover:text-white hover:border-white/40 transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Cars", value: cars.length },
            { label: "Available", value: cars.filter(c => c.status === "available").length },
            { label: "Sold", value: cars.filter(c => c.status === "sold").length },
          ].map(s => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
              <p className="text-3xl font-bold font-display text-white">{s.value}</p>
              <p className="text-xs uppercase tracking-widest text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex p-1 bg-white/5 border border-white/10 rounded-lg">
            {(["all", "available", "sold"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-5 py-2 rounded-md text-sm font-semibold uppercase tracking-wider transition-all ${
                  filter === f ? "bg-white text-black" : "text-white/50 hover:text-white"
                }`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={() => setFormMode("add")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold uppercase tracking-wider rounded-lg hover:bg-white/90 transition-colors text-sm">
            <Plus size={18} /> Add New Car
          </button>
        </div>

        {/* Car List */}
        <div className="space-y-2">
          {displayed.length === 0 && (
            <div className="py-16 text-center text-white/30 border border-white/10 rounded-xl">No cars to show.</div>
          )}
          {displayed.map((car, displayIdx) => {
            const globalIdx = cars.findIndex(c => c.id === car.id);
            const isFirst = globalIdx === 0;
            const isLast = globalIdx === cars.length - 1;
            return (
              <div key={car.id}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:border-white/20 transition-colors">

                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5 shrink-0">
                  <button
                    onClick={() => moveUp(car.id)}
                    disabled={isFirst}
                    title="Move up"
                    className="p-1 text-white/30 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <span className="text-center text-xs text-white/20 font-mono leading-none">{globalIdx + 1}</span>
                  <button
                    onClick={() => moveDown(car.id)}
                    disabled={isLast}
                    title="Move down"
                    className="p-1 text-white/30 hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-12 sm:w-20 sm:h-14 shrink-0 rounded-lg overflow-hidden bg-white/10">
                  {car.images[0] ? (
                    <img src={car.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20"><Image size={18} /></div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate text-sm sm:text-base">
                    {car.year} {car.make} {car.model}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {formatPrice(car.price)}
                    {car.wasPrice && !car.price === null && (
                      <span className="ml-1 text-primary/70">(was {formatPrice(car.wasPrice)})</span>
                    )}
                    {" · "}{car.mileage}
                  </p>
                </div>

                {/* Status */}
                <span className={`hidden sm:inline-block px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md shrink-0 ${
                  car.status === "available" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                }`}>
                  {car.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleStatus(car.id)}
                    title={car.status === "available" ? "Mark as Sold" : "Mark as Available"}
                    className="p-2 text-white/40 hover:text-white transition-colors">
                    {car.status === "available"
                      ? <ToggleRight size={22} className="text-emerald-400" />
                      : <ToggleLeft size={22} className="text-white/30" />}
                  </button>
                  <button onClick={() => { setEditingCar(car); setFormMode("edit"); }}
                    title="Edit" className="p-2 text-white/40 hover:text-white transition-colors">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(car.id)}
                    title={deleteConfirm === car.id ? "Click again to confirm" : "Delete"}
                    className={`p-2 transition-colors ${deleteConfirm === car.id ? "text-red-400" : "text-white/40 hover:text-red-400"}`}>
                    <Trash2 size={18} />
                  </button>
                  {deleteConfirm === car.id && (
                    <button onClick={() => setDeleteConfirm(null)} className="p-1 text-white/30 hover:text-white transition-colors">
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {deleteConfirm !== null && (
          <p className="mt-4 text-sm text-red-400/80 text-center">
            Click the trash icon again to confirm deletion. Click × to cancel.
          </p>
        )}
      </main>

      {formMode !== "none" && (
        <CarForm
          initial={formMode === "edit" && editingCar ? carToForm(editingCar) : EMPTY_FORM}
          onSave={handleSave}
          onCancel={() => { setFormMode("none"); setEditingCar(null); }}
        />
      )}
    </div>
  );
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "1");
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Auto Assets" className="h-32 w-auto mb-6" />
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest font-display text-center">Admin Access</h1>
          <p className="text-white/40 text-sm mt-2 text-center">Enter your password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-white/50 mb-2 font-semibold">Password</label>
            <input type="password" value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              className="w-full bg-black border border-white/20 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/60 placeholder:text-white/30 transition-colors"
              placeholder="Enter admin password" autoFocus />
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <button type="submit"
            className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white/90 transition-colors text-sm">
            Sign In
          </button>
        </form>
        <div className="text-center mt-6">
          <Link href="/" className="text-white/30 text-sm hover:text-white transition-colors">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  if (!authed) return <LoginPage onLogin={() => setAuthed(true)} />;
  return <AdminPanel />;
}
