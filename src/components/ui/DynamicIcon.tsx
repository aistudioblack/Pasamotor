import { lazy, Suspense, memo } from 'react'
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports
}

const DynamicIcon = memo(({ name, ...props }: IconProps) => {
  const LucideIcon = lazy(dynamicIconImports[name])
  return (
    <Suspense fallback={
      <div style={{ width: props.size || 24,
                    height: props.size || 24 }} />
    }>
      <LucideIcon {...(props as any)} />
    </Suspense>
  )
})

export default DynamicIcon
