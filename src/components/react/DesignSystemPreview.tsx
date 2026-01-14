import { useRef, useState } from 'react';
import { Button, Link } from '@/components/ui/button';
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
import { ModeToggle } from './ModeToggle';
import { Icon } from './Icon';
import { ArrowLeftIcon, Search01Icon, Mail01Icon } from '@hugeicons/core-free-icons';
import { toast } from '@/lib/toast';
import { getTranslatedPath, type Lang } from '@/i18n';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="border-border bg-card rounded-xl border p-6">{children}</div>
    </section>
  );
}

export function DesignSystemPreview({ lang }: { lang: Lang }) {
  const [inputValue, setInputValue] = useState('');
  const translatePath = getTranslatedPath(lang);

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <Link
          href={translatePath('/')}
          variant="outline"
          className="flex h-11 items-center gap-2 bg-white"
        >
          <Icon icon={ArrowLeftIcon} strokeWidth={2} />
          <span className="text-sm font-medium">Back to home</span>
        </Link>
        <ModeToggle />
      </div>
      {/* Colors */}
      <Section title="Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
          <ColorSwatch name="Background" className="bg-background" />
          <ColorSwatch name="Foreground" className="bg-foreground" />
          <ColorSwatch name="Primary" className="bg-primary" />
          <ColorSwatch name="Secondary" className="bg-secondary" />
          <ColorSwatch name="Muted" className="bg-muted" />
          <ColorSwatch name="Accent" className="bg-accent" />
          <ColorSwatch name="Destructive" className="bg-destructive" />
          <ColorSwatch name="Card" className="bg-card" />
          <ColorSwatch name="Border" className="bg-border" />
          <ColorSwatch name="Input" className="bg-input" />
          <ColorSwatch name="Ring" className="bg-ring" />
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
          <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
          <h3 className="text-2xl font-semibold tracking-tight">Heading 3</h3>
          <h4 className="text-xl font-semibold tracking-tight">Heading 4</h4>
          <p className="text-muted-foreground text-base">
            Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p className="text-muted-foreground text-sm">
            Small text - Used for captions and helper text.
          </p>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Button">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">Variants</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">Sizes</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">States</p>
            <div className="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Badge */}
      <Section title="Badge">
        <div className="space-y-4">
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">Standard</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">Pastel (Filled)</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="pastel-blue">Blue</Badge>
              <Badge variant="pastel-green">Green</Badge>
              <Badge variant="pastel-yellow">Yellow</Badge>
              <Badge variant="pastel-pink">Pink</Badge>
              <Badge variant="pastel-purple">Purple</Badge>
              <Badge variant="pastel-orange">Orange</Badge>
              <Badge variant="pastel-teal">Teal</Badge>
              <Badge variant="pastel-rose">Rose</Badge>
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">Pastel (Outlined)</p>
            <div className="flex flex-wrap gap-3">
              <Badge variant="pastel-blue-outline">Blue</Badge>
              <Badge variant="pastel-green-outline">Green</Badge>
              <Badge variant="pastel-yellow-outline">Yellow</Badge>
              <Badge variant="pastel-pink-outline">Pink</Badge>
              <Badge variant="pastel-purple-outline">Purple</Badge>
              <Badge variant="pastel-orange-outline">Orange</Badge>
              <Badge variant="pastel-teal-outline">Teal</Badge>
              <Badge variant="pastel-rose-outline">Rose</Badge>
            </div>
          </div>
        </div>
      </Section>

      {/* Card */}
      <Section title="Card">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description with supporting text.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content goes here. This is where the main content lives.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
              <CardDescription>Compact variant</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Smaller padding for denser layouts.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Form Elements */}
      <Section title="Form Elements">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="input-demo">Input</Label>
              <Input
                id="input-demo"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Disabled Input</Label>
              <Input id="input-disabled" placeholder="Disabled" disabled />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="textarea-demo">Textarea</Label>
            <Textarea id="textarea-demo" placeholder="Enter a longer message..." />
          </div>
        </div>
      </Section>

      {/* Select */}
      <Section title="Select">
        <div className="max-w-xs">
          <Select>
            <SelectTrigger>
              <SelectValue render={() => <span>Select an option</span>} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* Dropdown Menu */}
      <Section title="Dropdown Menu">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline">Open Menu</Button>} />
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      {/* Alert Dialog */}
      <Section title="Alert Dialog">
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="destructive">Delete Item</Button>} />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the item from your
                account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Section>

      {/* Separator */}
      <Section title="Separator">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">Horizontal separator:</p>
          <Separator />
          <div className="flex h-12 items-center gap-4">
            <span>Item 1</span>
            <Separator orientation="vertical" />
            <span>Item 2</span>
            <Separator orientation="vertical" />
            <span>Item 3</span>
          </div>
        </div>
      </Section>

      {/* Tooltip */}
      <Section title="Tooltip">
        <div className="flex flex-wrap gap-6">
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline">Hover me (top)</Button>} />
            <TooltipContent side="top">Tooltip on top</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline">Hover me (bottom)</Button>} />
            <TooltipContent side="bottom">Tooltip on bottom</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline">Hover me (left)</Button>} />
            <TooltipContent side="left">Tooltip on left</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger render={<Button variant="outline">Hover me (right)</Button>} />
            <TooltipContent side="right">Tooltip on right</TooltipContent>
          </Tooltip>
        </div>
      </Section>

      {/* Field */}
      <Section title="Field">
        <div className="grid gap-6 md:grid-cols-2">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="field-email">Email address</FieldLabel>
              <Input id="field-email" type="email" placeholder="you@example.com" />
              <FieldDescription>We'll never share your email.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="field-password">Password</FieldLabel>
              <Input id="field-password" type="password" placeholder="••••••••" />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field data-invalid="true">
              <FieldLabel htmlFor="field-error">With error</FieldLabel>
              <Input id="field-error" aria-invalid="true" defaultValue="invalid@" />
              <FieldError>Please enter a valid email address.</FieldError>
            </Field>
          </FieldGroup>
        </div>
      </Section>

      {/* InputGroup */}
      <Section title="InputGroup">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-muted-foreground mb-2 text-sm font-medium">With icon addon</p>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Icon icon={Search01Icon} className="size-4" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search..." />
            </InputGroup>
          </div>
          <div className="space-y-4">
            <p className="text-muted-foreground mb-2 text-sm font-medium">With button</p>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <Icon icon={Mail01Icon} className="size-4" />
              </InputGroupAddon>
              <InputGroupInput placeholder="Enter email..." />
              <InputGroupButton>Subscribe</InputGroupButton>
            </InputGroup>
          </div>
        </div>
      </Section>

      {/* Breadcrumb */}
      <Section title="Breadcrumb">
        <div className="space-y-6">
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">Basic</p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Blog</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Current Page</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <Separator />
          <div>
            <p className="text-muted-foreground mb-3 text-sm font-medium">With ellipsis</p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Category</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Current Page</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </Section>

      {/* Toast */}
      <Section title="Toast">
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Click buttons to trigger toast notifications (bottom-right).
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() =>
                toast.default('Default toast', { description: 'This is a default notification' })
              }
            >
              Default
            </Button>
            <Button
              variant="outline"
              className="border-green-500/50 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-950"
              onClick={() =>
                toast.success('Success!', { description: 'Your action was completed successfully' })
              }
            >
              Success
            </Button>
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() =>
                toast.error('Error', { description: 'Something went wrong. Please try again.' })
              }
            >
              Error
            </Button>
            <Button
              variant="outline"
              className="border-amber-500/50 text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
              onClick={() =>
                toast.warning('Warning', { description: 'Please review before continuing' })
              }
            >
              Warning
            </Button>
            <Button
              variant="outline"
              className="border-blue-500/50 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
              onClick={() => toast.info('Info', { description: 'Here is some useful information' })}
            >
              Info
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  const [colorValue, setColorValue] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const swatchRef = useRef<HTMLDivElement>(null);

  const setSwatchRef = (el: HTMLDivElement | null) => {
    swatchRef.current = el;
    if (el && !colorValue) {
      setColorValue(getComputedStyle(el).backgroundColor);
    }
  };

  const handleCopy = async () => {
    if (!colorValue) return;
    await navigator.clipboard.writeText(colorValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-2">
      <div
        ref={setSwatchRef}
        onClick={handleCopy}
        className={`border-border h-12 w-full cursor-pointer rounded-lg border transition-transform hover:scale-103 active:scale-97 ${className}`}
        title="Click to copy"
      />
      <div className="flex flex-col justify-between gap-1">
        <p className="text-foreground text-semibold text-sm">{name}</p>
        <p className="text-muted-foreground text-xs">{copied ? '✓ Copied' : colorValue}</p>
      </div>
    </div>
  );
}
