import { cn } from '@acme/libs/cn'
import { Button, buttonVariants } from '@acme/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@acme/ui/popover'
import { Code2, Cpu, Database, Figma, GitBranch, Globe, Layers, Package2, Terminal, Wrench } from 'lucide-react'
import React from 'react'

const technologies = [
  { icon: Code2, label: 'Code' },
  { icon: Cpu, label: 'CPU' },
  { icon: Database, label: 'DB' },
  { icon: Figma, label: 'Figma' },
  { icon: GitBranch, label: 'Git' },
  { icon: Globe, label: 'Web' },
  { icon: Layers, label: 'Layers' },
  { icon: Package2, label: 'Package' },
  { icon: Terminal, label: 'Terminal' },
  { icon: Wrench, label: 'Tools' },
]

export function TechnologiesSwitcher() {
  const [selected, setSelected] = React.useState<string[]>([technologies[0].label])

  const toggleSelection = (label: string) => {
    setSelected((prev) => {
      if (prev.includes(label)) {
        return prev.filter((item) => item !== label)
      }
      if (prev.length < 5) {
        return [...prev, label]
      }
      return prev
    })
  }

  const selectedTechs = technologies.filter((t) => selected.includes(t.label))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex flex-col items-start gap-1 h-[70px]">
          <span>Choose Technologies</span>
          <div className="flex gap-1 flex-wrap">
            {selectedTechs.map(({ icon: Icon, label }) => (
              <div className="grid place-content-center p-2 bg-white border rounded-md">
                <Icon key={label} className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] gap-2 flex flex-col m-2 p-4" align="end" side="top">
        <div className="flex items-center justify-between">
          <label className="text-sm text-accent-foreground">Favorite technologies</label>
          <span className="text-sm">({selected.length}/5)</span>
        </div>

        <ul className="grid grid-cols-4 gap-2">
          {technologies.map(({ icon: Icon, label }) => {
            const isSelected = selected.includes(label)
            const isMaxed = !isSelected && selected.length === 5

            return (
              <li
                key={label}
                className={cn(
                  buttonVariants({
                    variant: 'outline',
                    className: 'flex flex-col items-center justify-center gap-1 !size-16 text-xs',
                  }),
                  isSelected &&
                    'bg-acme-blue text-primary-foreground hover:bg-acme-blue/90 hover:text-primary-foreground',
                  isMaxed && 'pointer-events-none opacity-50',
                )}
                onClick={() => toggleSelection(label)}>
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
