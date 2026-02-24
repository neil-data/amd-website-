import AnimatedButton from '@/components/auth/AnimatedButton';

interface GoogleButtonProps {
  onClick?: () => void;
}

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  return <AnimatedButton type="button" variant="secondary" label="Continue with Google" onClick={onClick} />;
}
