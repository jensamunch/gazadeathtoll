import Image from 'next/image'

type ProseImageProps = {
  src: string
  alt: string
  caption?: string
  bleed?: 'none' | 'sm' | 'lg'
  priority?: boolean
  className?: string
}

export default function ProseImage({ src, alt, caption, bleed = 'lg', priority = false, className }: ProseImageProps) {
  const bleedClass = bleed === 'none' ? '' : bleed === 'sm' ? '-mx-4 sm:-mx-6' : '-mx-4 sm:-mx-6 lg:-mx-16'

  return (
    <figure className={`${bleedClass} my-10`}>
      <div className="relative w-full overflow-hidden rounded-lg bg-muted shadow-xl">
        <Image src={src} alt={alt} width={1600} height={900} className={`h-auto w-full ${className ?? ''}`} priority={priority} />
      </div>
      {caption ? <figcaption className="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  )
}


