// Understanding useCallback, useEffect, and re-rendering in React (By making a password Generator).
Re-rendering in React
  Re-rendering happens in React when the state or props of a component change. 
  When a component re-renders, React re-executes the function that defines the component, which means:
  - All the JSX is re-evaluated to determine what changes (if any) need to be made to the DOM.
  - All functions inside the component are redefined.
  - All variables inside the component are re-evaluated.

Why Re-rendering Happens
  React's re-rendering is central to its concept of declarative programming. Instead of manually updating the UI, you describe how the UI should look based on the current state and props, and React takes care of updating the DOM as efficiently as possible.

Use of useCallback
useCallback is used to memoize functions, i.e., to save a version of the function that only changes if its dependencies change. This can prevent unnecessary re-creations of the function on every render, which is particularly useful in two scenarios:

Passing Functions as Props: If a parent component passes a function to a child component as a prop, every time the parent re-renders, the function is redefined, causing the child to re-render. useCallback ensures that the function is only redefined if its dependencies change, preventing unnecessary re-renders of the child component.
Using Functions in Dependency Arrays: If a function is used in a dependency array of useEffect or other hooks, having the function redefined on every render would cause the effect to run on every render. useCallback helps ensure the effect only runs when necessary.
Use of useEffect
useEffect allows you to perform side effects in function components. It runs after the render and can run again if any of its dependencies change. It's commonly used for:

Data Fetching: Fetching data from an API.
Direct DOM Manipulations: Interacting directly with the DOM (e.g., focusing an input).
Setting Up Subscriptions: Setting up or tearing down subscriptions (e.g., WebSockets).
Example Explanation
In your example, both copyPasswordToClipboard and passwordGenerator are memoized using useCallback, ensuring they are not recreated unless their dependencies change. passwordGenerator is also called inside a useEffect hook, ensuring it runs whenever its dependencies (length, numberAllowed, charAllowed) change.

Re-rendering: Good or Bad?
Re-rendering itself is not inherently bad. It’s a natural part of React’s declarative model. However, unnecessary or excessive re-rendering can:

Affect Performance: Cause performance issues, particularly in complex components or large applications.
Trigger Unwanted Side Effects: If side effects (like API calls) are tied to renders, they might execute more times than intended.
React's virtual DOM diffing algorithm and hooks like useCallback, useMemo, and useEffect help mitigate unnecessary re-renders, optimizing performance and ensuring that components re-render only when necessary.

Recap
useCallback: Memoizes functions, ensuring they are only recreated if their dependencies change. This helps prevent unnecessary re-renders of child components or re-runs of effects.
useEffect: Runs side effects after the component renders and when its dependencies change. It ensures that effects run at the appropriate times based on state or prop changes.
Re-rendering: A core part of React’s update process, but it should be managed to prevent performance issues. Memoization with hooks helps manage re-renders efficiently.
Why useCallback and useEffect Together
Using useCallback to memoize functions ensures that functions used in dependency arrays of useEffect or passed to child components are stable references. This prevents unnecessary re-runs of effects and unnecessary re-renders of child components, leading to more efficient and performant applications.

In summary, proper management of re-renders using hooks like useCallback and useEffect can greatly enhance the performance and efficiency of React applications, ensuring that components only update when truly necessary.

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


