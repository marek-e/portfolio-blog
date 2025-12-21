import { useState } from 'react';
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
import { ModeToggle } from './ModeToggle';
import { Icon } from './Icon';
import { ArrowLeftIcon } from '@hugeicons/core-free-icons';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="border-border bg-card rounded-xl border p-6">{children}</div>
    </section>
  );
}

export function DesignSystemPreview() {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <Link href="/" variant="outline" className="flex h-11 items-center gap-2 bg-white">
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
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
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
          <DropdownMenuTrigger>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
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
          <AlertDialogTrigger>
            <Button variant="destructive">Delete Item</Button>
          </AlertDialogTrigger>
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
    </div>
  );
}

function ColorSwatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="space-y-2">
      <div className={`border-border h-12 w-full rounded-lg border ${className}`} />
      <p className="text-muted-foreground text-xs">{name}</p>
    </div>
  );
}
