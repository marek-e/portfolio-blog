import { useState, type ReactNode } from 'react';
import { Button, Link } from '@/components/ui/button';
import { Button3D } from '@/components/ui/button-3d';
import { Card3D } from '@/components/ui/card-3d';
import { DevIdCard } from '@/components/portfolio/DevIdCard';
import { ProjectCardReact } from '@/components/portfolio/ProjectCardReact';
import blinkImage from '@/assets/projects/blink.png';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Field, FieldLabel, FieldDescription, FieldError, FieldGroup } from '@/components/ui/field';
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from '@/components/ui/input-group';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import { PastelCard, PastelCards } from '@/components/mdx/PastelCard';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Icon } from '@/components/shared/Icon';
import { Doodle, MarkedText } from '@/components/shared/HandDrawn';
import {
  ArrowRight01Icon,
  Search01Icon,
  Mail01Icon,
  SparklesIcon,
} from '@hugeicons/core-free-icons';
import { getTranslatedPath, type Lang } from '@/i18n';
import type { DesignSystemGroup } from './sections';

function Specimen({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="border-border space-y-6 border-t pt-8">
      <div className="space-y-2">
        <h3 className="font-sans text-base font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="eyebrow mb-4">{children}</p>;
}

const pastels = [
  { name: 'Peach', fr: 'Pêche', token: 'pastel-peach', className: 'bg-pastel-peach' },
  { name: 'Rose', fr: 'Rose', token: 'pastel-rose', className: 'bg-pastel-rose' },
  { name: 'Lilac', fr: 'Lilas', token: 'pastel-lilac', className: 'bg-pastel-lilac' },
  { name: 'Sky', fr: 'Ciel', token: 'pastel-sky', className: 'bg-pastel-sky' },
  { name: 'Mint', fr: 'Menthe', token: 'pastel-mint', className: 'bg-pastel-mint' },
  { name: 'Butter', fr: 'Beurre', token: 'pastel-butter', className: 'bg-pastel-butter' },
];

const semanticTokens = [
  'background',
  'foreground',
  'primary',
  'secondary',
  'muted',
  'accent',
  'destructive',
  'card',
  'border',
  'input',
  'ring',
  'marker',
];
const doodleNames = ['underline', 'squiggle', 'sparkle', 'arrow', 'loop', 'circle'] as const;

export function DesignSystemPreview({
  group,
  lang,
  ageAtBuild,
}: {
  group: DesignSystemGroup;
  lang: Lang;
  ageAtBuild: number;
}) {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const text = (fr: string, en: string) => (lang === 'fr' ? fr : en);
  const translatePath = getTranslatedPath(lang);
  const categories = {
    development: text('Développement', 'Development'),
    design: 'Design',
    writing: text('Écriture', 'Writing'),
  };

  return (
    <div className="min-w-0 space-y-12">
      {group === 'foundations' && (
        <>
          <Specimen
            title={text('La couleur de marque', 'Brand colour')}
            description={text(
              'Orange le jour, violet la nuit. Le token primary suit le thème du site.',
              'Orange by day, purple by night. The primary token follows the site theme.'
            )}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <ColorSwatch
                name={text('Jour · Orange', 'Day · Orange')}
                token="day-primary"
                lang={lang}
                large
              />
              <ColorSwatch
                name={text('Nuit · Violet', 'Night · Purple')}
                token="night-primary"
                lang={lang}
                large
              />
            </div>
          </Specimen>
          <Specimen
            title={text('La palette pastel', 'Pastel palette')}
            description={text(
              'Des accents pour les cartes, les badges et les annotations. Cliquer sur une couleur copie sa variable CSS.',
              'Accents for cards, badges and annotations. Select a colour to copy its CSS variable.'
            )}
          >
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-6">
              {pastels.map((swatch) => (
                <ColorSwatch
                  key={swatch.token}
                  name={text(swatch.fr, swatch.name)}
                  token={swatch.token}
                  lang={lang}
                />
              ))}
            </div>
            <div className="border-pastel-mint bg-pastel-mint/35 dark:border-pastel-mint/40 dark:bg-pastel-mint/12 rounded-2xl border p-5">
              <p className="text-pastel-mint-ink text-sm font-medium">
                {text('Un fond teinté, une encre lisible.', 'A tinted background, readable ink.')}
              </p>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {text(
                  'Utiliser les variantes -ink pour le texte coloré. Les paragraphes gardent la couleur de texte du site.',
                  'Use the -ink variants for coloured text. Paragraphs keep the site text colour.'
                )}
              </p>
            </div>
          </Specimen>
          <Specimen title={text('Les tokens sémantiques', 'Semantic tokens')}>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 xl:grid-cols-4">
              {semanticTokens.map((token) => (
                <ColorSwatch key={token} name={token} token={token} lang={lang} />
              ))}
            </div>
          </Specimen>
          <Specimen title={text('Trois polices, trois rôles', 'Three typefaces, three roles')}>
            <div className="space-y-8">
              <div>
                <Caption>01 · Fraunces</Caption>
                <p className="font-display-soft text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  {text('Le sens du', 'Made with')}{' '}
                  <MarkedText>{text('détail', 'care')}</MarkedText>
                </p>
                <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
                  {text(
                    'Titres de page, de section et de carte. Une dernière expression en italique, soulignée au marqueur.',
                    'Page, section and card headings. An italic closing word with a hand-drawn marker.'
                  )}
                </p>
              </div>
              <div className="grid gap-6 border-t pt-8 sm:grid-cols-2">
                <div>
                  <Caption>02 · Geist</Caption>
                  <p className="text-xl leading-relaxed">
                    {text('Des mots faciles à lire.', 'Words that are easy to read.')}
                  </p>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {text(
                      'Paragraphes, navigation, boutons, dates et légendes. Le texte courant laisse les titres prendre leur place.',
                      'Body copy, navigation, buttons, dates and captions. Quiet supporting text gives headings room.'
                    )}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Badge>Astro</Badge>
                    <Badge variant="outline">React</Badge>
                  </div>
                </div>
                <div>
                  <Caption>03 · Maple Mono</Caption>
                  <p className="font-mono text-xl font-medium tabular-nums">10.42 km · 5:24 /km</p>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {text(
                      "Code, mesures et signatures techniques. Une ponctuation, pas la police de toute l'interface.",
                      'Code, metrics and technical signatures. An accent, rather than the default UI typeface.'
                    )}
                  </p>
                  <code className="text-primary mt-5 block text-sm">const craft = 'care';</code>
                </div>
              </div>
            </div>
          </Specimen>
          <Specimen
            title={text('Les traits dessinés', 'Hand-drawn marks')}
            description={text(
              'Le marqueur accompagne les titres. Les autres traits restent des accents ponctuels.',
              'The marker accompanies headings. Other marks are occasional accents.'
            )}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {doodleNames.map((name) => (
                <div
                  key={name}
                  className="bg-muted/50 flex flex-col items-center gap-4 rounded-2xl px-3 py-6"
                >
                  <Doodle
                    name={name}
                    className={
                      name === 'sparkle' ? 'text-pastel-lilac size-10' : 'text-marker h-10 w-24'
                    }
                  />
                  <code className="text-muted-foreground text-xs">{name}</code>
                </div>
              ))}
            </div>
          </Specimen>
        </>
      )}

      {group === 'materials' && (
        <>
          <Specimen title={text('Choisir une surface', 'Choose a surface')}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="surface rounded-3xl p-6">
                <Caption>{text('Lecture · Projets · Blog', 'Reading · Projects · Blog')}</Caption>
                <p className="font-display-soft text-2xl font-semibold">
                  {text('Le papier', 'Paper')}
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {text(
                    'Une surface pleine, une bordure fine et une ombre douce. La base des pages de contenu.',
                    'A solid surface, a thin border and a soft shadow. The foundation for content pages.'
                  )}
                </p>
                <code className="text-muted-foreground mt-6 block text-xs">
                  surface · rounded-3xl
                </code>
              </div>
              <div className="bg-pastel-peach/35 border-pastel-peach dark:bg-pastel-peach/12 dark:border-pastel-peach/40 rounded-3xl border p-6">
                <Caption>{text('Annotations · Encadrés', 'Annotations · Callouts')}</Caption>
                <p className="font-display-soft text-pastel-peach-ink text-2xl font-semibold">
                  {text('Le pastel', 'Pastel')}
                </p>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {text(
                    'Une teinte franche pour regrouper une idée ou distinguer une information dans un article.',
                    'A clear tint to group an idea or distinguish information within an article.'
                  )}
                </p>
                <code className="text-muted-foreground mt-6 block text-xs">
                  pastel-peach · pastel-peach-ink
                </code>
              </div>
            </div>
          </Specimen>
          <Specimen
            title={text('Le verre, en contexte', 'Glass, in context')}
            description={text(
              "Réservé aux cartes de l'accueil et à quelques appels à l'action, dont le panneau de contact partagé. Les deux variantes utilisent le même contour.",
              'Reserved for homepage cards and occasional calls to action, including the shared contact panel. Both variants share the same contour.'
            )}
          >
            <div className="relative isolate grid gap-6 py-6 sm:grid-cols-2">
              <div
                className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
                aria-hidden="true"
              >
                <div className="bg-pastel h-full w-full opacity-70 dark:opacity-25" />
              </div>
              <Card3D className="m-3 gap-5 p-6 sm:m-2 sm:p-7">
                <div className="card-3d-icon text-primary">
                  <Icon icon={SparklesIcon} className="size-7" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-display-soft text-2xl font-semibold">
                    {text('Au premier plan', 'In the foreground')}
                  </h4>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {text(
                      "La carte de l'expérience actuelle, avec une matière plus présente.",
                      'The current experience card, with a more pronounced material.'
                    )}
                  </p>
                </div>
                <code className="text-muted-foreground mt-auto text-xs">Card3D · default</code>
              </Card3D>
              <Card3D variant="glass" className="m-3 gap-5 p-6 sm:m-2 sm:p-7">
                <div className="card-3d-icon text-primary">
                  <Icon icon={Mail01Icon} className="size-7" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="font-display-soft text-2xl font-semibold">
                    {text('Tout en transparence', 'A clearer view')}
                  </h4>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {text(
                      'Le parcours et le contact, avec des reflets plus fins.',
                      'Past experience and contact, with finer reflections.'
                    )}
                  </p>
                </div>
                <code className="text-muted-foreground mt-auto text-xs">Card3D · glass</code>
              </Card3D>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
              <span>
                <code>glass</code>
                <span className="text-muted-foreground">
                  {' '}
                  · {text('translucide', 'translucent')}
                </span>
              </span>
              <span>
                <code>glass-strong</code>
                <span className="text-muted-foreground">
                  {' '}
                  · {text('contenu dense', 'dense content')}
                </span>
              </span>
              <span>
                <code>ring-pastel</code>
                <span className="text-muted-foreground">
                  {' '}
                  · {text('un accent par vue', 'one accent per view')}
                </span>
              </span>
            </div>
          </Specimen>
          <Specimen
            title={text('Le verre liquide des projets', 'Project liquid glass')}
            description={text(
              'Une surface transparente, un bord bombé et des reflets sur la carte et son image.',
              'A clear face, a rounded lens edge and reflections around the card and its artwork.'
            )}
          >
            <div className="mx-auto max-w-sm py-4">
              <ProjectCardReact
                project={{
                  title: 'Blink',
                  description: text(
                    'Un sélecteur de navigateur natif pour macOS qui route vos liens.',
                    'A native macOS browser picker that routes your links.'
                  ),
                  techStack: ['Swift', 'SwiftUI', 'AppKit'],
                  links: { repo: 'https://github.com/marek-e/blink' },
                  image: blinkImage.src,
                  imageAlt: 'Blink',
                  objectFit: 'contain',
                  imagePadding: 24,
                }}
                projectUrl={translatePath('/projects/blink')}
                translations={{
                  liveDemo: 'Live',
                  code: 'Code',
                  viewDetails: text('Voir les détails', 'View details'),
                }}
              />
            </div>
          </Specimen>
          <Specimen title={text('La carte développeur', 'Developer ID card')}>
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="mx-auto w-full max-w-sm">
                <DevIdCard lang={lang} ageAtBuild={ageAtBuild} />
              </div>
              <div className="space-y-5">
                <p className="font-display-soft text-2xl leading-snug font-semibold">
                  {text(
                    'La même identité, sur les deux faces.',
                    'The same identity, on both sides.'
                  )}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {text(
                    "La carte de l'accueil réunit la typographie éditoriale, Melo et le cadre de verre. Le verso garde la signature et le ruban irisé.",
                    'The homepage card combines editorial type, Melo and a glass frame. The reverse keeps the signature and iridescent ribbon.'
                  )}
                </p>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {text(
                    'Cliquer à gauche ou à droite pour la retourner. Au clavier et avec la réduction des animations, le changement est immédiat.',
                    'Click the left or right half to turn it. Keyboard activation and reduced motion switch faces immediately.'
                  )}
                </p>
              </div>
            </div>
          </Specimen>
        </>
      )}

      {group === 'actions' && (
        <>
          <Specimen
            title={text('Les boutons classiques', 'Classic buttons')}
            description={text(
              'Radiant pour une action principale, pastel pour une alternative. Les variantes discrètes accompagnent le contenu.',
              'Radiant for the primary action, pastel for an alternative. Quieter variants accompany content.'
            )}
          >
            <div className="flex flex-wrap items-center gap-4">
              <Link href={translatePath('/projects')} className="min-h-11">
                {text('Voir les projets', 'View projects')}
                <Icon icon={ArrowRight01Icon} aria-hidden="true" />
              </Link>
              <Link href={translatePath('/cv')} variant="pastel" className="min-h-11">
                {text('Voir mon CV', 'View my CV')}
              </Link>
              <Button variant="ghost" className="min-h-11">
                Ghost
              </Button>
              <Button variant="destructive" className="min-h-11">
                {text('Supprimer', 'Delete')}
              </Button>
              <Button variant="link" className="min-h-11">
                {text('En savoir plus', 'Learn more')}
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <Caption>{text('Tailles', 'Sizes')}</Caption>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="xs">XS</Button>
                  <Button size="sm">SM</Button>
                  <Button>MD</Button>
                  <Button size="lg">LG</Button>
                </div>
              </div>
              <div>
                <Caption>{text('États', 'States')}</Caption>
                <div className="flex flex-wrap gap-3">
                  <Button className="min-h-11">{text('Disponible', 'Enabled')}</Button>
                  <Button disabled className="min-h-11">
                    {text('Désactivé', 'Disabled')}
                  </Button>
                </div>
              </div>
            </div>
          </Specimen>
          <Specimen
            title={text('Les boutons de verre', 'Glass buttons')}
            description={text(
              "Pour les appels à l'action de l'accueil et les liens sociaux du contact. Le libellé reste immobile au survol.",
              'For homepage calls to action and contact social links. The label stays still on hover.'
            )}
          >
            <div className="flex flex-wrap items-center gap-6 py-4">
              <Button3D size="lg">{text('Principal', 'Primary')}</Button3D>
              <Button3D variant="secondary" size="lg">
                {text('Secondaire', 'Secondary')}
              </Button3D>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Button3D size="sm">SM</Button3D>
              <Button3D>MD</Button3D>
              <Button3D variant="secondary" size="icon" aria-label={text('Rechercher', 'Search')}>
                <Icon icon={Search01Icon} />
              </Button3D>
              <Button3D disabled>{text('Désactivé', 'Disabled')}</Button3D>
            </div>
          </Specimen>
          <Specimen title={text('Les badges', 'Badges')}>
            <div className="space-y-6">
              <div>
                <Caption>{text('Neutres & sémantiques', 'Neutral & semantic')}</Caption>
                <div className="flex flex-wrap gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="glass">Glass</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </div>
              <div>
                <Caption>{text('Pastels pleins', 'Filled pastels')}</Caption>
                <div className="flex flex-wrap gap-3">
                  {(
                    ['blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'teal', 'rose'] as const
                  ).map((color) => (
                    <Badge key={color} variant={`pastel-${color}`}>
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Caption>{text('Pastels détourés', 'Outlined pastels')}</Caption>
                <div className="flex flex-wrap gap-3">
                  {(
                    ['blue', 'green', 'yellow', 'pink', 'purple', 'orange', 'teal', 'rose'] as const
                  ).map((color) => (
                    <Badge key={color} variant={`pastel-${color}-outline`}>
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Specimen>
        </>
      )}

      {group === 'forms' && (
        <>
          <Specimen title={text('Les champs de saisie', 'Text inputs')}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="input-demo">{text('Votre nom', 'Your name')}</Label>
                  <Input
                    id="input-demo"
                    placeholder="Marek Elmayan"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="input-disabled">
                    {text('Champ désactivé', 'Disabled input')}
                  </Label>
                  <Input
                    id="input-disabled"
                    placeholder={text('Indisponible', 'Unavailable')}
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="textarea-demo">Message</Label>
                <Textarea
                  id="textarea-demo"
                  className="min-h-32"
                  placeholder={text('Parlons de votre projet…', 'Tell me about your project…')}
                />
              </div>
            </div>
          </Specimen>
          <Specimen title={text('Aide & validation', 'Guidance & validation')}>
            <div className="grid gap-6 sm:grid-cols-2">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="field-email">
                    {text('Adresse email', 'Email address')}
                  </FieldLabel>
                  <Input
                    id="field-email"
                    type="email"
                    placeholder="you@example.com"
                    aria-describedby="email-help"
                  />
                  <FieldDescription id="email-help">
                    {text('Pour répondre à votre message.', 'To reply to your message.')}
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="field-password">
                    {text('Mot de passe', 'Password')}
                  </FieldLabel>
                  <Input
                    id="field-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                  />
                </Field>
              </FieldGroup>
              <FieldGroup>
                <Field data-invalid="true">
                  <FieldLabel htmlFor="field-error">
                    {text('Adresse à corriger', 'Address to correct')}
                  </FieldLabel>
                  <Input
                    id="field-error"
                    aria-invalid="true"
                    aria-describedby="email-error"
                    defaultValue="invalid@"
                  />
                  <FieldError id="email-error">
                    {text(
                      'Saisissez une adresse email complète.',
                      'Enter a complete email address.'
                    )}
                  </FieldError>
                </Field>
              </FieldGroup>
            </div>
          </Specimen>
          <Specimen title={text('Les champs composés', 'Input groups')}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="search-demo">
                  {text('Rechercher un article', 'Search articles')}
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Icon icon={Search01Icon} className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="search-demo"
                    placeholder={text('Un sujet, un mot-clé…', 'A topic, a keyword…')}
                  />
                </InputGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subscribe-demo">
                  {text('Inscription · Démonstration', 'Subscribe · Demo')}
                </Label>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Icon icon={Mail01Icon} className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput id="subscribe-demo" type="email" placeholder="you@example.com" />
                  <InputGroupButton
                    aria-label={text(
                      "S'inscrire, démonstration sans envoi",
                      'Subscribe, demonstration only'
                    )}
                  >
                    {text("S'inscrire", 'Subscribe')}
                  </InputGroupButton>
                </InputGroup>
              </div>
            </div>
          </Specimen>
          <Specimen title={text('La sélection', 'Selection')}>
            <div className="max-w-xs space-y-2">
              <Label htmlFor="category-demo">{text('Catégorie', 'Category')}</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                items={categories}
              >
                <SelectTrigger id="category-demo" className="min-h-11 w-full">
                  <SelectValue placeholder={text('Choisir une catégorie', 'Choose a category')} />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Specimen>
        </>
      )}

      {group === 'overlays' && (
        <>
          <Specimen title={text('Le menu déroulant', 'Dropdown menu')}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="pastel" className="min-h-11">
                    {text('Ouvrir le menu', 'Open menu')}
                  </Button>
                }
              />
              <DropdownMenuContent>
                <DropdownMenuItem>{text('Profil', 'Profile')}</DropdownMenuItem>
                <DropdownMenuItem>{text('Paramètres', 'Settings')}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{text('Déconnexion', 'Sign out')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Specimen>
          <Specimen
            title={text('La confirmation', 'Confirmation')}
            description={text(
              'Cet exemple ne supprime aucune donnée.',
              'This example does not delete any data.'
            )}
          >
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" className="min-h-11">
                    {text('Supprimer un élément', 'Delete an item')}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {text('Supprimer cet élément ?', 'Delete this item?')}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {text(
                      'Ceci est une démonstration du dialogue de confirmation. Aucune donnée ne sera supprimée.',
                      'This is a confirmation dialog demonstration. No data will be deleted.'
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{text('Annuler', 'Cancel')}</AlertDialogCancel>
                  <AlertDialogAction>{text('Confirmer', 'Confirm')}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Specimen>
          <Specimen
            title={text('Les infobulles', 'Tooltips')}
            description={text(
              'Une aide complémentaire, également visible à la prise de focus.',
              'Supplementary guidance, also available on keyboard focus.'
            )}
          >
            <div className="flex flex-wrap gap-3">
              {(['top', 'bottom', 'left', 'right'] as const).map((side, index) => (
                <Tooltip key={side}>
                  <TooltipTrigger
                    render={
                      <Button variant="ghost" className="min-h-11">
                        {text(['En haut', 'En bas', 'À gauche', 'À droite'][index], side)}
                      </Button>
                    }
                  />
                  <TooltipContent side={side}>
                    {text('Une précision utile.', 'A useful detail.')}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </Specimen>
        </>
      )}

      {group === 'content' && (
        <>
          <Specimen
            title={text('Les cartes de contenu', 'Content cards')}
            description={text(
              'Des cartes pleines pour les pages de lecture. Les titres éditoriaux gardent Fraunces.',
              'Solid cards for reading pages. Editorial headings keep Fraunces.'
            )}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Card className="rounded-3xl">
                <CardHeader>
                  <CardTitle className="font-display-soft text-2xl font-semibold">
                    {text('Une idée à explorer', 'An idea to explore')}
                  </CardTitle>
                  <CardDescription>
                    {text('Projet, article ou ressource.', 'A project, article or resource.')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {text(
                      'Un titre, quelques mots de contexte et une action explicite.',
                      'A heading, a little context and a clear action.'
                    )}
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href={translatePath('/blog')} variant="pastel" className="min-h-11">
                    {text('Lire le blog', 'Read the blog')}
                    <Icon icon={ArrowRight01Icon} aria-hidden="true" />
                  </Link>
                </CardFooter>
              </Card>
              <Card size="sm" className="rounded-3xl">
                <CardHeader>
                  <CardTitle className="font-display-soft text-xl font-semibold">
                    {text('Format compact', 'Compact format')}
                  </CardTitle>
                  <CardDescription>
                    {text('Une densité adaptée au contenu.', 'Density that suits the content.')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {text(
                      "Moins d'espace intérieur pour les informations secondaires.",
                      'Less internal space for supporting information.'
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          </Specimen>
          <Specimen title={text('Les encadrés pastel', 'Pastel cards')}>
            <PastelCards>
              {(
                ['slate', 'stone', 'red', 'orange', 'green', 'blue', 'purple', 'pink'] as const
              ).map((color) => (
                <PastelCard
                  key={color}
                  label={color}
                  title={text('Une idée à retenir', 'An idea to remember')}
                  color={color}
                >
                  {text(
                    'Une bordure teintée et une ombre décalée pour les encadrés du blog.',
                    'A tinted border and offset shadow for blog callouts.'
                  )}
                </PastelCard>
              ))}
            </PastelCards>
            <div className="grid gap-6 sm:grid-cols-2">
              <PastelCard color="blue" title={text('Sans étiquette', 'Without a label')}>
                {text('Le titre et le texte suffisent.', 'A heading and body copy are enough.')}
              </PastelCard>
              <PastelCard color="green">
                {text(
                  'Un encadré peut aussi contenir du texte seul.',
                  'A callout can also contain only body copy.'
                )}
              </PastelCard>
            </div>
          </Specimen>
          <Specimen title={text("Le fil d'Ariane", 'Breadcrumbs')}>
            <div className="space-y-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={translatePath('/')}>
                      {text('Accueil', 'Home')}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={translatePath('/blog')}>Blog</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{text('Article', 'Article')}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={translatePath('/')}>
                      {text('Accueil', 'Home')}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{text('Page actuelle', 'Current page')}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </Specimen>
          <Specimen
            title={text('Les langues', 'Languages')}
            description={text(
              'Le contrôle compact utilisé dans la navigation mobile.',
              'The compact control used in mobile navigation.'
            )}
          >
            <LanguageSwitcher
              currentLang={lang}
              currentPath={translatePath('/design-system')}
              variant="plain"
              className="w-fit"
            />
          </Specimen>
          <Specimen title={text('Les séparateurs', 'Separators')}>
            <div className="space-y-6">
              <Separator />
              <div className="flex h-8 items-center gap-4 text-sm">
                <span>Astro</span>
                <Separator orientation="vertical" />
                <span>React</span>
                <Separator orientation="vertical" />
                <span>TypeScript</span>
              </div>
            </div>
          </Specimen>
        </>
      )}
    </div>
  );
}

function ColorSwatch({
  name,
  token,
  lang,
  large = false,
}: {
  name: string;
  token: string;
  lang: Lang;
  large?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const variable = `var(--${token})`;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(variable);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="min-w-0 space-y-3">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${lang === 'fr' ? 'Copier' : 'Copy'} ${variable}`}
        className={`border-foreground/10 block w-full cursor-copy rounded-2xl border ${large ? 'h-28' : 'h-20'}`}
        style={{ backgroundColor: variable }}
      />
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">{name}</p>
        <p aria-live="polite" className="text-muted-foreground font-sans text-xs break-words">
          {status === 'copied'
            ? lang === 'fr'
              ? 'Variable copiée'
              : 'Variable copied'
            : status === 'error'
              ? lang === 'fr'
                ? 'Copie indisponible'
                : 'Copy unavailable'
              : `--${token}`}
        </p>
      </div>
    </div>
  );
}
