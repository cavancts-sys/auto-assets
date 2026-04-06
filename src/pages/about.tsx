import { Layout } from "../components/layout";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <Layout>
      {/* Hero Header */}
      <section className="relative pt-40 pb-20 px-4 flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <img
            src={`${import.meta.env.BASE_URL}images/garage-hero.png`}
            alt="N2 Auto Sandton Showroom"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display font-black text-5xl md:text-6xl text-white uppercase tracking-wider mb-4">
              About <span className="text-primary text-glow">Us</span>
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Excellence in service. A passion for quality vehicles.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="font-display font-bold text-4xl text-white uppercase tracking-wider mb-4">
              N2 Auto <span className="text-primary">Sandton</span>
            </h2>
            <div className="w-20 h-1 bg-primary box-glow mb-8" />
            <p className="text-white/80 text-lg leading-relaxed">
              At N2 Auto Sandton, we are committed to creating a seamless and trustworthy car-buying experience, driven by excellence in service and a passion for quality vehicles. Our team operates with a customer-first mindset, ensuring every interaction is professional, transparent, and tailored to individual needs. We foster a culture of integrity, teamwork, and continuous growth, where both staff and customers feel valued and empowered. Whether in retail or wholesale, our goal is to build lasting relationships and set new standards in the automotive industry.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/garage"
                className="px-8 py-4 bg-primary text-black font-bold uppercase tracking-widest rounded-sm hover:bg-white transition-all duration-300 box-glow-hover text-center"
              >
                View Inventory
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest rounded-sm hover:bg-white/10 transition-all duration-300 text-center"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-2xl overflow-hidden border border-border"
          >
            <img
              src={`${import.meta.env.BASE_URL}images/garage-hero.png`}
              alt="N2 Auto Sandton Showroom"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { title: "Integrity", desc: "Transparent dealings and honest communication in every interaction." },
            { title: "Excellence", desc: "Setting new standards in the automotive industry through quality and service." },
            { title: "Customer First", desc: "Every decision is made with our customers' best interests at heart." },
          ].map((v, i) => (
            <div key={i} className="bg-card border border-border p-8 rounded-xl">
              <div className="w-12 h-1 bg-primary mb-4 box-glow" />
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-3">{v.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="https://www.google.com/maps?q=-26.108786,28.077868"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors font-semibold"
          >
            Visit us in Wynberg, Sandton <ArrowRight size={16} />
          </a>
        </motion.div>
      </section>
    </Layout>
  );
}
