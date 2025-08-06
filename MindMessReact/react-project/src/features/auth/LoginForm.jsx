import { useState, forwardRef, useImperativeHandle } from 'react';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { requestMagicLink } from './auth.api';

const schema = z.object({
  email: z.string().email('Invalid email!'), 
});

const LoginForm = forwardRef(({ onSuccess, onError, onLoadingChange }, ref) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => requestMagicLink(email),
    onSuccess: () => {
      onSuccess();
      onLoadingChange?.(false);
    },
    onError: (err) => {
      const msg = err?.response?.data?.error;
      onError(msg);
      onLoadingChange?.(false);
    },
    onMutate: () => onLoadingChange?.(true),
  });

  const submit = (e) => {
    e ? e.preventDefault() : null;
    const parsed = schema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
    } else {
      setError();
      mutate();
    }
  };

  useImperativeHandle(ref, () => ({ submit }));

  return (
    <form className="space-y-2" onSubmit={submit}>
      <input
        type="email"
        placeholder="email"
        className={`input-default ${error ? 'border-red placeholder-red focus:placeholder-gray-400' : ''}`}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </form>
  );
});

export default LoginForm;
