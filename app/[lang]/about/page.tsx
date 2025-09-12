import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import MDXWrapper from './MDXWrapper'
import Link from 'next/link'
import Image from 'next/image'
import { getDictionary } from '../dictionaries'

type Person = {
  name: string
  titleKey: string
  link: string
  photo?: string // filename in public/team
}

const people: Person[] = [
  {
    name: 'Wil Grace',
    titleKey: 'productLeader',
    link: 'https://www.linkedin.com/in/wilgrace/',
    photo: 'wil.jpg',
  },
  {
    name: 'Heidi El-Hosaini',
    titleKey: 'geoDataTech',
    link: 'https://www.instagram.com/he.idi.eh/?hl=en',
    photo: 'heidi.jpg',
  },
  {
    name: 'Randa Mirza',
    titleKey: 'visualArtist',
    link: 'http://www.randamirza.com/',
    photo: 'randa.jpg',
  },
  {
    name: 'Jens Munch',
    titleKey: 'strategistTechBuilder',
    link: 'https://www.jensmunch.com/',
    photo: 'jens.jpg',
  },
  {
    name: 'Imran Sulemanji',
    titleKey: 'technicalLead',
    link: 'https://www.linkedin.com/in/imransulemanji/',
    photo: 'imran.jpg',
  },
  {
    name: 'Yousef Eldin',
    titleKey: 'directorOfVideo',
    link: 'http://yousefeldin.com/info/',
    photo: 'yousef.jpg',
  },
  {
    name: 'Joshua Andresen',
    titleKey: 'internationalLawyer',
    link: 'https://www.linkedin.com/in/joshua-andresen-690907262/',
    photo: 'joshua.jpg',
  },
]

type Props = {
  params: Promise<{ lang: 'ar' | 'en' }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  const title = lang === 'ar' ? 'حول' : 'About'

  return {
    title,
  }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = await params

  if (!['ar', 'en'].includes(lang)) {
    notFound()
  }

  const dict = await getDictionary(lang)

  return (
    <div className="mx-auto max-w-2xl space-y-12">
      <article className="prose lg:prose-xl">
        <MDXWrapper lang={lang} />
      </article>

      <div className="border-t pt-12">
        <h2 className="mb-8 text-3xl font-bold">{dict.advisoryTeam.title}</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {people.map((p) => (
            <li key={p.name} className="flex items-center gap-3 p-2">
              <div className="h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={p.photo ? `/team/${p.photo}` : '/placeholder-male-square.png'}
                  alt={p.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium">
                  <Link
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {p.name}
                  </Link>
                </div>
                <div className="text-muted-foreground truncate text-sm">
                  {dict.advisoryTeam[p.titleKey as keyof typeof dict.advisoryTeam]}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
