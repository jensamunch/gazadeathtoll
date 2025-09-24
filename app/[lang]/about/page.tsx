import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    <div className="mx-auto max-w-4xl space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{dict.advisoryTeam.title}</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          {lang === 'ar'
            ? 'فريق من الخبراء والمتخصصين الملتزمين بتوثيق وحفظ ذكرى كل حياة ضائعة'
            : 'A team of experts and specialists committed to documenting and preserving the memory of every life lost'}
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {people.map((p) => (
          <li key={p.name} className="bg-card flex items-start gap-4 rounded-lg border p-4">
            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={p.photo ? `/team/${p.photo}` : '/placeholder-male-square.png'}
                alt={p.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 font-medium">
                <Link
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {p.name}
                </Link>
              </div>
              <div className="text-muted-foreground mb-2 text-sm font-medium">
                {dict.advisoryTeam[p.titleKey as keyof typeof dict.advisoryTeam]}
              </div>
              <div className="text-muted-foreground text-sm leading-relaxed">
                {dict.advisoryTeam[`${p.titleKey}Desc` as keyof typeof dict.advisoryTeam]}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* FAQ Section */}
      <div className="border-t pt-12">
        <h2 className="mb-8 text-center text-3xl font-bold">{dict.faq.title}</h2>
        <div className="space-y-4">
          {dict.faq.questions.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-left text-lg">{item.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
