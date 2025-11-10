export function AnimatedTitle() {
  return (
    <div className="relative inline-flex flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-4 select-none">
      {/* Inxora */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold gradient-text">
        Inxora
      </h1>

      {/* Logo in the middle */}
      <div className="relative flex items-center justify-center">
        <img
          src="/logo-nobg.png"
          alt="Inxora Logo"
          className="h-10 md:h-16 lg:h-20 w-auto object-contain"
          draggable={false}
        />
      </div>

      {/* Studio */}
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold gradient-text">
        Studio
      </h1>
    </div>
  )
}
