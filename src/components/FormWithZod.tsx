import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';
import { UserRegister, userRegisterSchema } from '../schema';
import toast from 'react-hot-toast';

export default function FormWithZod() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    resetField,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({ resolver: zodResolver(userRegisterSchema) }); // adding the type <UserRegister> makes it easier to use the methods

  const registerWithMask = useHookFormMask(register);

  function handleZipcodeChange(ev: React.FocusEvent<HTMLInputElement>) {
    const zipcode = ev.target.value;
    if (!zipcode.match(/^\d{5}-\d{3}$/)) {
      resetField('address');
      resetField('city');
      return;
    }

    axios
      .get(`https://brasilapi.com.br/api/cep/v2/${zipcode}`)
      .then((res) => {
        setValue('address', `${res.data.street}, ${res.data.neighborhood}`);
        setValue('city', `${res.data.city}, ${res.data.state}`);
        clearErrors(['zipcode', 'address', 'city']);
      })
      .catch((err) => {
        console.log(err.response.data);
        setError('zipcode', {
          type: 'manual',
          message: err.response.data.message,
        });
        resetField('address');
        resetField('city');
      });
  }

  async function onSubmit(data: FieldValues) {
    await axios
      .post(`https://apis.codante.io/api/register-user/register`, data)
      .then((res) => {
        toast.success('Usuário cadastrado com sucesso!');
        console.log(res.data);
        reset();
      })
      .catch((err) => {
        toast.error(
          'Erro ao cadastrar o usuário: ' + err.response.data.message
        );
        console.log(err.response.data);
        const errors = err.response.data.errors;
        for (const key in errors) {
          setError(key as keyof UserRegister, {
            type: 'manual',
            message: errors[key],
          });
        }
      });
  }

  return (
    // wrap custom submit function within react hook form submit function
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className=''>
        <label htmlFor='name'>Nome Completo</label>
        <input type='text' id='name' {...register('name')} />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='name' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='email'>E-mail</label>
        <input className='' type='email' id='email' {...register('email')} />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='email' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='password'>Senha</label>
        <div className='relative'>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id='password'
            {...register('password')}
          />
          <button
            type='button'
            className='absolute right-3 top-3 text-slate-600'
            onClick={() => setIsPasswordVisible((prev) => !prev)}>
            {isPasswordVisible ? (
              <EyeOffIcon size={20} />
            ) : (
              <EyeIcon size={20} />
            )}
          </button>
        </div>
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='password' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='password_confirmation'>Confirmar Senha</label>
        <div className='relative'>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id='password_confirmation'
            {...register('password_confirmation')}
          />
          <button
            type='button'
            className='absolute right-3 top-3 text-slate-600'
            onClick={() => setIsPasswordVisible((prev) => !prev)}>
            {isPasswordVisible ? (
              <EyeOffIcon className='' size={20} />
            ) : (
              <EyeIcon size={20} className='' />
            )}
          </button>
        </div>
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='password_confirmation' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='phone'>Telefone Celular</label>
        <input
          type='text'
          id='phone'
          {...registerWithMask('phone', '(99) 99999-9999')}
        />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='phone' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='cpf'>CPF</label>
        <input type='text' id='cpf' {...registerWithMask('cpf', 'cpf')} />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='cpf' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='zipcode'>CEP</label>
        <input
          type='text'
          id='zipcode'
          {...registerWithMask('zipcode', '99999-999', {
            onChange: handleZipcodeChange,
          })}
        />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='zipcode' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='address'>Endereço</label>
        <input
          className='disabled:bg-slate-200'
          type='text'
          id='address'
          {...register('address')}
          disabled
        />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='address' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='city'>Cidade</label>
        <input
          className='disabled:bg-slate-200'
          type='text'
          id='city'
          {...register('city')}
          disabled
        />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='city' />
        </p>
      </div>

      {/* terms and conditions input */}
      <div className=''>
        <input
          type='checkbox'
          id='terms'
          className='mr-2 accent-slate-500'
          {...register('terms')}
        />
        <label
          className='text-sm  font-light text-slate-500 mb-1 inline'
          htmlFor='terms'>
          Aceito os{' '}
          <span className='underline hover:text-slate-900 cursor-pointer'>
            termos e condições
          </span>
        </label>
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='terms' />
        </p>
      </div>

      <button
        type='submit'
        className='bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors disabled:bg-slate-300 relative'
        disabled={isSubmitting}>
        Cadastrar
        {isSubmitting && (
          <LoaderCircleIcon
            className='absolute right-4 bottom-4 animate-spin'
            strokeWidth={3}
          />
        )}
      </button>
    </form>
  );
}
