import FormHeader from './components/FormHeader';
import FormWithZod from './components/FormWithZod';

function App() {
  return (
    <main className='bg-sky-100 min-h-screen xl:p-10 flex items-center'>
      <div className='mx-auto bg-slate-50 container max-w-md px-10 py-6 border-slate-300 border-2 rounded-2xl'>
        <FormHeader />
        {/* <FormWithReactHookForm /> */}
        <FormWithZod />
      </div>
    </main>
  );
}

export default App;
