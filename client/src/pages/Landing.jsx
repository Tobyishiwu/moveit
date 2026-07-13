import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const HeroIllustration = () => (
  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group bg-gray-100">
    <img
      src="/images/hero-rider.png"
      alt="MoveIt rider on an orange and black delivery motorcycle"
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 border border-white/20"
    >
      <span className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center text-lg" role="img" aria-label="parcel">
        📦
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900 leading-tight">Reliable delivery</p>
        <p className="text-xs text-teal-600 font-medium">Tracked live, every trip</p>
      </div>
    </motion.div>
  </div>
);

const PhoneMockup = () => (
  <div className="w-56 mx-auto rounded-[2.5rem] border-8 border-primary bg-primary p-2 shadow-2xl transition-transform duration-500 hover:rotate-1">
    <div className="bg-white rounded-[2rem] overflow-hidden aspect-[9/19] p-4 flex flex-col justify-between select-none">
      <div>
        {/* Profile header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm" role="img" aria-label="waving hand">
            👋
          </span>
          <div>
            <p className="text-[10px] text-gray-400 font-medium">Good morning</p>
            <p className="text-xs font-bold text-gray-800">Toby!</p>
          </div>
        </div>

        {/* Search bar mockup */}
        <div className="bg-gray-50 border border-gray-100 rounded-full px-3 py-2 text-[10px] text-gray-400 mb-4 flex items-center gap-2">
          <span>🔍</span> Where to?
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {["📦", "🍔", "🛒", "💊"].map((icon, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center py-2.5 text-sm hover:bg-orange-50 transition cursor-pointer">
              {icon}
            </div>
          ))}
        </div>

        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Recent Orders</p>
        <div className="bg-gray-50 rounded-lg h-9 mb-2 border border-gray-100/50" />
        <div className="bg-gray-50 rounded-lg h-9 border border-gray-100/50" />
      </div>
      
      {/* Dynamic indicator bar */}
      <div className="w-16 h-1 bg-gray-200 rounded-full mx-auto mt-2" />
    </div>
  </div>
);

const SERVICES = [
  { icon: "📄", title: "Documents & Parcels", desc: "Contracts, gifts, electronics, and vital papers." },
  { icon: "🍔", title: "Food & Takeout", desc: "Order from your favorite spot, delivered piping hot." },
  { icon: "🛒", title: "Groceries & Errands", desc: "Open market runs, staples, and everyday essentials." },
  { icon: "💊", title: "Pharmacy Items", desc: "Medications and wellness packages handled safely." },
  { icon: "⚡", title: "Custom Requests", desc: "If our delivery rider can carry it, MoveIt can move it." },
];

const STEPS = [
  { step: "1", title: "Request", desc: "Tell us what you need delivered and pick-up locations." },
  { step: "2", title: "Rider Accepts", desc: "A nearby professional, verified rider claims it immediately." },
  { step: "3", title: "On the Way", desc: "Track your transit progress live across town in real time." },
  { step: "4", title: "Delivered Securely", desc: "Your item arrives safely — pay balance smoothly your way." },
];

const STATS = [
  { icon: "📏", value: "By Distance", label: "Transparent pricing scaling with trip mileage" },
  { icon: "⚖️", value: "By Weight", label: "Fair rates structured for heavier parcels" },
  { icon: "📍", value: "Live GPS", label: "End-to-end active tracking on every assignment" },
  { icon: "✅", value: "100% Verified", label: "Strictly vetted, admin-screened trusted dispatchers" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800 selection:bg-orange-100 selection:text-accent">
      
      {/* Navbar */}
      <nav className="px-6 py-5 flex justify-between items-center max-w-6xl mx-auto structural-nav">
        <Link to="/" className="font-display font-black text-2xl tracking-tight text-gray-900">
          Move<span className="text-accent">It</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="text-accent">Home</Link>
          <a href="#services" className="hover:text-black transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-black transition-colors">How It Works</a>
          <Link to="/register" className="hover:text-black transition-colors">Become a Rider</Link>
        </div>
        <Link
          to="/register"
          className="bg-primary text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/20 hover:brightness-110 transition duration-200"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-accent text-xs font-bold px-3 py-1.5 rounded-full mb-6 border border-orange-100">
            ⚡ Enugu's premier on-demand delivery service
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-black tracking-tight text-gray-900 leading-[1.05]">
            Anything.<br />
            Anywhere.<br />
            <span className="text-accent">MoveIt</span> it.
          </h1>
          <p className="text-gray-500 text-lg mt-6 max-w-md leading-relaxed">
            Fast, reliable, and affordable deliveries within the city. From secure documents 
            to dinner requests, we move it with maximum care.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/register"
              className="bg-accent text-white font-semibold px-7 py-3.5 rounded-full shadow-lg shadow-accent/20 hover:brightness-110 transition inline-flex items-center gap-2"
            >
              Book a Delivery <span className="text-lg">→</span>
            </Link>
            <Link
              to="/login"
              className="border border-gray-200 bg-white text-gray-700 font-semibold px-7 py-3.5 rounded-full hover:bg-gray-50 hover:border-gray-300 transition"
            >
              Track a Delivery
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <HeroIllustration />
        </motion.div>
      </section>

      {/* Services Section */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-24 border-t border-gray-100 scroll-mt-6">
        <p className="text-center text-accent text-xs font-bold tracking-widest uppercase mb-2">
          Our Services
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-black text-center text-gray-900 mb-14">
          What would you like to move today?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {SERVICES.map((s) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-transparent bg-white transition duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="text-3xl filter drop-shadow-sm" role="img" aria-label={s.title}>{s.icon}</span>
                <h3 className="font-bold text-gray-900 mt-4 group-hover:text-accent transition-colors">{s.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{s.desc}</p>
              </div>
              <span className="text-accent text-lg mt-4 block transform translate-x-0 group-hover:translate-x-1.5 transition-transform">→</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-sand py-24 px-6 scroll-mt-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-accent text-xs font-bold tracking-widest uppercase mb-2">
            How It Works
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-black text-center text-gray-900 mb-16">
            Four simple steps to seamless dispatch
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 text-center relative">
            {STEPS.map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center font-display font-black text-xl shadow-md shadow-primary/20">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 mt-5 text-lg">{s.title}</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Matrix Section */}
      <section className="bg-primary py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="text-white p-2">
              <span className="text-3xl" role="img" aria-label={s.value}>{s.icon}</span>
              <p className="font-display text-2xl font-black mt-3 tracking-tight">{s.value}</p>
              <p className="text-orange-100/80 text-xs mt-1.5 max-w-[160px] mx-auto leading-normal">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Container */}
      <footer className="bg-sand border-t border-gray-200/60">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-[auto_1fr_auto_auto] gap-12 items-start">
          <PhoneMockup />

          <div className="md:pl-6">
            <h2 className="font-display text-3xl font-black text-gray-900 leading-tight">
              The MoveIt platform<br />makes logistics easier.
            </h2>
            <p className="text-gray-500 mt-4 max-w-sm text-sm leading-relaxed">
              Download the smartphone interface now to access blazing fast, secure, and fully transparent fulfillment.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#playstore" className="bg-black text-white rounded-xl px-5 py-2.5 flex items-center gap-3 text-xs font-medium hover:bg-gray-900 transition shadow-md">
                <span className="text-base">▶</span> <span>Get it on<br /><strong className="text-sm font-bold">Google Play</strong></span>
              </a>
              <a href="#appstore" className="bg-black text-white rounded-xl px-5 py-2.5 flex items-center gap-3 text-xs font-medium hover:bg-gray-900 transition shadow-md">
                <span className="text-base">🍏</span> <span>Download on the<br /><strong className="text-sm font-bold">App Store</strong></span>
              </a>
            </div>
          </div>

          <div className="min-w-[120px]">
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Company</p>
            <ul className="space-y-3 text-sm font-medium text-gray-600">
              <li><a href="#about" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#careers" className="hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#blog" className="hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#press" className="hover:text-accent transition-colors">Press</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div className="min-w-[120px]">
            <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">Support</p>
            <ul className="space-y-3 text-sm font-medium text-gray-600">
              <li><a href="#help" className="hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#faqs" className="hover:text-accent transition-colors">FAQs</a></li>
              <li><a href="#terms" className="hover:text-accent transition-colors">Terms & Conditions</a></li>
              <li><a href="#privacy" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#cookies" className="hover:text-accent transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Lower Utility Footer Footer */}
        <div className="max-w-6xl mx-auto px-6 pb-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200/60 pt-8">
          <span className="font-display font-black text-xl text-gray-900">
            Move<span className="text-accent">It</span>
          </span>
          <div className="flex gap-4">
            {["f", "𝕏", "◎", "in"].map((icon) => (
              <a
                href={`#social-${icon}`}
                key={icon}
                aria-label={`Follow MoveIt on ${icon}`}
                className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-sm font-semibold text-gray-500 hover:text-accent hover:border-accent transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-400">© 2026 MoveIt Logistics Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;