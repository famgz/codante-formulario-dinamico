import axios from 'axios';
import { EyeIcon, EyeOffIcon, LoaderCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { withMask } from 'use-mask-input';

export default function Form() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [address, setAddress] = useState({
    city: '',
    street: '',
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  function handleZipcodeBlur(ev: React.FocusEvent<HTMLInputElement>) {
    const zipcode = ev.target.value;

    axios
      .get(`https://brasilapi.com.br/api/cep/v2/${zipcode}`)
      .then((res) =>
        setAddress({
          city: res.data.city,
          street: res.data.street,
        })
      )
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  async function onSubmit(data: FieldValues) {
    await axios
      .post(`https://apis.codante.io/api/register-user/register`, data)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err.response.data));
  }

  return (
    // wrap custom submit function within react hook form submit function
    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
      <div className=''>
        <label htmlFor='name'>Nome Completo</label>
        <input type='text' id='name' {...register('name')} />
        {/* Sugestão de exibição de erro de validação */}
        <div className='min-h-4'>
          <p className='text-xs text-red-400 mt-1'>O nome é obrigatório.</p>
        </div>
      </div>
      <div className=''>
        <label htmlFor='email'>E-mail</label>
        <input className='' type='email' id='email' {...register('email')} />
      </div>
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
      </div>
      <div className=''>
        <label htmlFor='confirm-password'>Confirmar Senha</label>
        <div className='relative'>
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id='confirm-password'
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
      </div>
      <div className=''>
        <label htmlFor='phone'>Telefone Celular</label>
        <input type='text' id='phone' ref={withMask('(99) 99999-9999')} />
      </div>
      <div className=''>
        <label htmlFor='cpf'>CPF</label>
        <input type='text' id='cpf' ref={withMask('cpf')} />
      </div>
      <div className=''>
        <label htmlFor='cep'>CEP</label>
        <input
          type='text'
          id='cep'
          ref={withMask('99999-999')}
          onBlur={handleZipcodeBlur}
        />
      </div>
      <div className=''>
        <label htmlFor='address'>Endereço</label>
        <input
          className='disabled:bg-slate-200'
          type='text'
          id='address'
          value={address.street}
          disabled
        />
      </div>
      <div className=''>
        <label htmlFor='city'>Cidade</label>
        <input
          className='disabled:bg-slate-200'
          type='text'
          id='city'
          value={address.city}
          disabled
        />
      </div>
      {/* terms and conditions input */}
      <div className=''>
        <input type='checkbox' id='terms' className='mr-2 accent-slate-500' />
        <label
          className='text-sm  font-light text-slate-500 mb-1 inline'
          htmlFor='terms'>
          Aceito os{' '}
          <span className='underline hover:text-slate-900 cursor-pointer'>
            termos e condições
          </span>
        </label>
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
