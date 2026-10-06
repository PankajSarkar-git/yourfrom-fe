import * as React from 'react';
import { Input } from './ui/input';
import { cn } from '../lib/utils';
import { AlertCircle, Eye, EyeOff, Info } from 'lucide-react';

// InfoTooltip Component
const InfoTooltip: React.FC<{
  content: React.ReactNode;
  title: string;
  toolTipClassname?: string;
}> = ({ content, title, toolTipClassname }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className='relative inline-block'>
      <button
        type='button'
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className='w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200 flex items-center justify-center ml-2 focus:outline-none focus:ring-2 focus:ring-brand-primary/20'
        aria-label='More information'
      >
        <Info size={12} />
      </button>

      {isVisible && (
        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50'>
          <div
            className={`bg-white border border-neutral-200 rounded-xl shadow-lg p-4 w-60 text-sm ${toolTipClassname}`}
          >
            <div className='flex items-start gap-2 mb-2'>
              <Info
                size={16}
                className='text-brand-primary flex-shrink-0 mt-0.5'
              />
              <h4 className='font-semibold text-neutral-900'>{title}</h4>
            </div>
            <div className='text-neutral-600 leading-relaxed'>{content}</div>
            {/* Tooltip arrow */}
            <div className='absolute top-[98%] left-1/2 transform -translate-x-1/2'>
              <div className='w-3 h-3 bg-white border-r border-b border-neutral-200 rotate-45 transform origin-center'></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string; // for outer wrapper
  inputClassName?: string; // for the input element
  label?: string | React.ReactNode; // Updated to support React.ReactNode for complex labels
  labelClassName?: string;
  error?: string;
  helperText?: string;
  success?: boolean;
  showPasswordToggle?: boolean;
  height?: string;
  iconLeftClassName?: string;
  // New props for enhanced functionality
  infoTooltip?: {
    title: string;
    content: React.ReactNode;
    toolTipClassName?: string;
  };
}

export const CustomInput = React.forwardRef<
  HTMLInputElement,
  InputWithIconProps
>(
  (
    {
      iconLeft,
      iconRight,
      className,
      inputClassName,
      label,
      labelClassName,
      error,
      helperText,
      success,
      height = 'h-12',
      showPasswordToggle,
      type: initialType,
      id,
      iconLeftClassName,
      infoTooltip,

      step, // This is automatically included from React.InputHTMLAttributes
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const inputId =
      id || props.name || `input-${Math.random().toString(36).slice(2, 8)}`;

    const type =
      showPasswordToggle && initialType === 'password'
        ? showPassword
          ? 'text'
          : 'password'
        : initialType;

    const hasError = Boolean(error);
    const hasSuccess = success && !hasError;
    const hasValue = Boolean(props.value || props.defaultValue);

    // Render label with optional info tooltip
    const renderLabel = () => {
      if (!label) return null;

      const labelContent =
        typeof label === 'string' ? (
          <span>
            {label}
            {props.required && <span className='text-red-500 ml-1'>*</span>}
          </span>
        ) : (
          <div className='flex items-center'>
            {label}
            {props.required && <span className='text-red-500 ml-1'>*</span>}
          </div>
        );

      return (
        <label
          htmlFor={inputId}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            hasError
              ? 'text-red-700'
              : isFocused || hasSuccess
                ? 'text-brand-primary'
                : 'text-neutral-700',
            labelClassName
          )}
        >
          <div className='flex items-center'>
            {labelContent}
            {infoTooltip && (
              <InfoTooltip
                content={infoTooltip.content}
                title={infoTooltip.title}
                toolTipClassname={infoTooltip.toolTipClassName}
              />
            )}
          </div>
        </label>
      );
    };

    return (
      <div className={cn('w-full space-y-1 px-0.5', className)}>
        {/* Label with optional info tooltip */}
        {renderLabel()}

        {/* Input Container */}
        <div className='relative h-10'>
          <div
            className={cn(
              'relative flex items-center transition-all duration-200',
              'rounded-lg border bg-white overflow-hidden',
              // Focus states
              isFocused &&
                !hasError &&
                'ring-2 ring-brand-primary/20 border-brand-primary',
              // Error states
              hasError && 'border-red-400 ring-2 ring-red-100',
              // Success states
              hasSuccess && 'border-green-400 ring-2 ring-green-100',
              // Default state
              !isFocused &&
                !hasError &&
                !hasSuccess &&
                'border-neutral-300 hover:border-neutral-400',
              // Disabled state
              props.disabled &&
                'bg-neutral-50 border-neutral-200 cursor-not-allowed'
            )}
          >
            {/* Left Icon */}
            {iconLeft && (
              <div
                className={cn(
                  'absolute left-3 flex items-center transition-colors duration-200',
                  hasError
                    ? 'text-red-500'
                    : isFocused || hasSuccess
                      ? 'text-brand-primary'
                      : 'text-neutral-400',
                  iconLeftClassName
                )}
              >
                {iconLeft}
              </div>
            )}

            {/* Input Field */}
            <Input
              id={inputId}
              ref={ref}
              type={type}
              step={step} // Pass step prop to the input
              className={cn(
                'w-full border-0 bg-transparent shadow-none focus-visible:ring-0',
                'placeholder:text-neutral-400 text-neutral-900',
                ' text-base transition-colors duration-200',
                iconLeft && 'pl-10',
                height,
                (iconRight || showPasswordToggle || hasError || hasSuccess) &&
                  'pr-10',
                props.disabled && 'cursor-not-allowed text-neutral-500',
                'h-10',
                inputClassName
              )}
              onFocus={e => {
                setIsFocused(true);
                props.onFocus?.(e);
              }}
              onBlur={e => {
                setIsFocused(false);
                props.onBlur?.(e);
              }}
              {...props}
            />

            {/* Right Side Icons */}
            <div className='absolute right-3 flex items-center gap-2'>
              {/* Success Icon */}
              {hasSuccess && !iconRight && (
                <div className='text-green-500'>
                  <svg
                    className='w-4 h-4'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              )}

              {/* Error Icon */}
              {hasError && !iconRight && (
                <div className='text-red-500'>
                  <AlertCircle className='w-4 h-4' />
                </div>
              )}

              {/* Password Toggle */}
              {showPasswordToggle && initialType === 'password' && (
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'flex items-center justify-center transition-colors duration-200',
                    'text-neutral-400 hover:text-neutral-600 focus:text-brand-primary',
                    'focus:outline-none'
                  )}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className='w-4 h-4' />
                  ) : (
                    <Eye className='w-4 h-4' />
                  )}
                </button>
              )}

              {/* Custom Right Icon */}
              {iconRight && !showPasswordToggle && (
                <div
                  className={cn(
                    'pointer-events-none flex items-center transition-colors duration-200',
                    hasError
                      ? 'text-red-500'
                      : isFocused || hasSuccess
                        ? 'text-brand-primary'
                        : 'text-neutral-400'
                  )}
                >
                  {iconRight}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Helper Text / Error Message */}
        {(error || helperText) && (
          <div
            className={cn(
              'text-xs transition-colors duration-200 px-1',
              hasError ? 'text-red-600' : 'text-neutral-500'
            )}
          >
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';
