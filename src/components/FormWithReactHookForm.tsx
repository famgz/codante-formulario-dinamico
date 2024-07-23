import axios from 'axios';
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useHookFormMask } from 'use-mask-input';
import { ErrorMessage } from '@hookform/error-message';

export default function FormWithReactHookForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting, errors },
  } = useForm();

  const registerWithMask = useHookFormMask(register);

  const requiredMessage = 'Campo obrigatório';

  function handleZipcodeChange(ev: React.FocusEvent<HTMLInputElement>) {
    const zipcodeFromInput = ev.target.value;
    if (!zipcodeFromInput.match(/^\d{5}-\d{3}$/)) return;

    axios
      .get(`https://brasilapi.com.br/api/cep/v2/${zipcodeFromInput}`)
      .then((res) => {
        setValue('address', `${res.data.street}, ${res.data.neighborhood}`);
        setValue('city', `${res.data.city}, ${res.data.state}`);
        clearErrors('zipcode');
      })
      .catch((err) => {
        console.log(err.response.data);
        setError('zipcode', {
          type: 'manual',
          message: err.response.data.message,
        });
      });
  }

  async function onSubmit(data: FieldValues) {
    await axios
      .post(`https://apis.codante.io/api/register-user/register`, data)
      .then((res) => console.log(res.data))
      .catch((err) => {
        console.log(err.response.data);
        const errors = err.response.data.errors;
        for (const key in errors) {
          setError(key, { type: 'manual', message: errors[key] });
        }
      });
  }

  return (
    // wrap custom submit function within react hook form submit function
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className=''>
        <label htmlFor='name'>Nome Completo</label>
        <input
          type='text'
          id='name'
          {...register('name', {
            required: requiredMessage,
            maxLength: {
              value: 255,
              message: 'O nome deve ter no máximo 255 caracteres',
            },
            minLength: {
              value: 3,
              message: 'O nome deve ter no mínimo 3 caracteres',
            },
          })}
        />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='name' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='email'>E-mail</label>
        <input
          className=''
          type='email'
          id='email'
          {...register('email', {
            required: requiredMessage,
            pattern: {
              value: /^[a-z0-9._%+_]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
              message: 'Email inválido',
            },
          })}
        />
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
            {...register('password', {
              required: requiredMessage,
              minLength: {
                value: 8,
                message: 'A senha deve ter no mínimo 8 caracteres',
              },
            })}
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
            {...register('password_confirmation', {
              required: requiredMessage,
              minLength: {
                value: 8,
                message: 'A senha deve ter no mínimo 8 caracteres',
              },
              validate: (value, formValues) => {
                if (value === formValues.password) return true;
                return 'As senhas devem coincidir';
              },
            })}
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
          {...registerWithMask('phone', '(99) 99999-9999', {
            required: requiredMessage,
            pattern: {
              value: /^\(\d{2}\) \d{5}-\d{4}$/,
              message: 'Telefone inválido',
            },
          })}
        />
        <p className='text-xs text-red-400 mt-1'>
          <ErrorMessage errors={errors} name='phone' />
        </p>
      </div>

      {/*  */}
      <div className=''>
        <label htmlFor='cpf'>CPF</label>
        <input
          type='text'
          id='cpf'
          {...registerWithMask('cpf', 'cpf', {
            required: requiredMessage,
            pattern: {
              value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
              message: 'CPF inválido',
            },
          })}
        />
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
            required: requiredMessage,
            pattern: {
              value: /^\d{5}-\d{3}$/,
              message: 'CEP inválido',
            },
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
          {...register('address', { required: requiredMessage })}
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
          // value={address.city}
          {...register('city', { required: requiredMessage })}
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
          {...register('terms', { required: requiredMessage })}
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
