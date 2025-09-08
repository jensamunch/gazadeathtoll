import Link from 'next/link'
import Image from 'next/image'

type Person = {
  name: string
  title: string
  link: string
  photo?: string // filename in public/team
}

const people: Person[] = [
  {
    name: 'Wil Grace',
    title: 'Product leader',
    link: 'https://www.linkedin.com/in/wilgrace/',
    photo: 'wil.jpg',
  },
  {
    name: 'Jens Munch',
    title: 'Strategist & Tech builder',
    link: 'https://www.jensmunch.com/',
    photo: 'jens.jpg',
  },
  {
    name: 'Imran Sulemanji',
    title: 'Technical Lead',
    link: 'https://www.linkedin.com/in/imransulemanji/',
  },
  {
    name: 'Joshua Andresen',
    title: 'International lawyer & Legal academic',
    link: 'https://www.linkedin.com/in/joshua-andresen-690907262/',
    photo: 'joshua.jpg',
  },
  {
    name: 'Yousef Eldin',
    title: 'Director of video',
    link: 'http://yousefeldin.com/info/',
  },
  {
    name: 'Randa Mirza',
    title: 'Photographer',
    link: 'http://www.randamirza.com/',
  },
  {
    name: 'Heidi El-Hosaini',
    title: 'Geo data tech & Activism',
    link: 'https://www.instagram.com/he.idi.eh/?hl=en',
    photo: 'heidi.jpg',
  },
]

export default function AdvisoryTeamPage() {
  return (
    <div className="space-y-6">
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
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {p.name}
                </a>
              </div>
              <div className="text-muted-foreground truncate text-sm">{p.title}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
