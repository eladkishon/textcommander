import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/utils/Helpers';

import { buttonVariants } from './buttonVariants';
import { LoaderCircle } from 'lucide-react';

export type ButtonProps = {
  asChild?: boolean;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {isLoading ? <LoaderCircle className="w-4 h-4 mr-2" /> : null}
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button };
