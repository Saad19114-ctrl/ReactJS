// Understanding useCallback, useEffect, and re-rendering in React (By making a password Generator).

export function PasswordGenerator() {

  const [password, setPassword] = useState('')
  const [length, setLength] = useState(8)
  const [character, charAllowed] = useState(false)
  const [number, numberAllowed] = useState(false)
  const [previousPassword, setPreviousPassword] = useState(password)

  const passwordRef = useRef(null)

  const copyPasswordto = useCallback(() => {
    console.log(password)
    passwordRef.current?.select()
    window.navigator.clipboard.writeText(password)
    alert('Password copied to clipboard!');

  }, [password])


  const passwordGenerator = () => {
    let pass = '';
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    let characters = '<>?/,.;!@#$%^&*()-_+=`~';
    let numbers = '1234567890'

    if (character) letters += characters;
    if (number) letters += numbers;

    for (let i = 0; i < length; i++) {
      let number = Math.floor(Math.random() * letters.length);
      pass += letters.charAt(number);

    }
    setPassword(pass)
    setPreviousPassword(pass)
  }

  useCallback(passwordGenerator, [length, character, number])

  useEffect(passwordGenerator, [length, character, number])

  return (

    <>
      <div className='flex flex-col w-full h-screen gap-5'>
        <hr />
        <hr />
        <br />
        <h1> Password Generator</h1>
        <div>
          <label>
            <input name="myInput"
              value={password}
              ref={passwordRef}
              className='border-2  border-rose-600	w-96 h-10 bg-slate-900 text-orange-500 readOnly' />
          </label>
          <button onClick={copyPasswordto} className='border-2 border-pink-500 bg-slate-300'> copy </button>
          <button onClick={() => {
            console.log(previousPassword )
          }}> Previous Passwords </button>
        </div>
        <button onClick={passwordGenerator} className='text-slate-50 bg-zinc-600 px-2 py-3 w-80 mx-auto hover:bg-zinc-400 hover:text-black'> Generate Password </button>
        <hr />
        <input type="range" onChange={(e) => {
          setLength(e.target.value)
        }} min={6} max={100} className='w-52 mx-auto' name="myCheckbox" />
        <label>
          Length: {length}
        </label>
        <label>
          Characters: <input type="checkbox" defaultChecked={character} onChange={() => { charAllowed((prev) => !prev) }} name="myCheckbox" />
        </label>
        <label>
          Numbers: <input type="checkbox" defaultChecked={number} onChange={() => { numberAllowed((prev) => !prev) }} name="myCheckbox" />
        </label>

      </div>
    </>

  )
}


