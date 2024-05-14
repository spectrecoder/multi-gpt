'use client'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';


interface Model {
  id: string;
}



export default function Home() {
  const searchParams = useSearchParams();
  const [apiKey, setApiKey] = useState('');
  const [message, setMessage] = useState('');
  const [models, setModels] = useState<Model[]>([]); // State to store model names
  const [selectedModel, setSelectedModel] = useState(''); // State to store the selected model ID
  const [inputText, setInputText] = useState(''); // State to store the entered text
  const [isLoading, setIsLoading] = useState(false); // State to track the loading status

  useEffect(() => {

    const storedApiKey = window.localStorage.getItem('apiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }

    async function fetchApiData() {
      // Check for the code in the URL query parameters
      const code = searchParams.get('code');

      if (code) {
        const apiRoute = '/api/oauth'; // Adjust to your API route

        // Prepare the request options
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        };

        try {
          // Fetch data from your API route
          const response = await fetch(apiRoute, requestOptions);
          const data = await response.json();
          // Handle the data from the API
          console.log('Token or response received:', data);
          if (data.key) {
            // Store the key in localStorage and update state
            window.localStorage.setItem('apiKey', data.key);
            setApiKey(data.key);
          }
        } catch (error) {
          // Handle any errors here
          console.error('Error fetching data:', error);
        }
      }
    }

    async function fetchModels() {
      try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        const data = await response.json();
        setModels(data.data);

        if (data.data.length > 0) {
          setSelectedModel(data.data[0].id);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    }

    fetchApiData();
    fetchModels();

  }, [searchParams]);

  const openRouterAuth = () => {
    window.open('https://openrouter.ai/auth?callback_url=http://localhost:3000/')
  }

  const getCompletionsResponse = async () => {
    setIsLoading(true);

    const apiRoute = '/api/completions';

    const requestBody = {
      apiKey,
      model: selectedModel,
      text: inputText,
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    };

    try {
      // Fetch data from your API route
      const response = await fetch(apiRoute, requestOptions);
      const data = await response.json();
      // Handle the data from the API
      const messageResponse = data.choices[0].message.content
      setMessage(messageResponse)
      setIsLoading(false);

    } catch (error) {
      // Handle any errors here
      console.error('Error fetching data:', error);
      setIsLoading(false)
    }
  }

  const handleModelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(event.target.value); // Update the selectedModel state with the new value
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value); // Update the inputText state with the new value
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-[35rem]">
      {/* Conditional Button for Logging Out */}
      {apiKey ?
        <button
          className="absolute top-5 right-5 rounded-lg bg-blue-600 text-white py-2 px-4 hover:bg-blue-500 shadow-lg transition duration-150 ease-in-out"
          onClick={() => {
            console.log("Logging out...");
            window.localStorage.removeItem('apiKey');
            setApiKey('');
          }}
        >
          <h3 className="text-lg font-bold">Log Out</h3>
        </button>
        :
        <></>
      }
      {/* If API Key is created an returned show this component */}
      {apiKey ? (
        <>
          <div className="w-2/3 mx-auto text-center mt-10 mb-4">
            <label htmlFor="model-dropdown" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Choose Model (all available OpenRouter models)
            </label>
            <select
              id="model-dropdown"
              name="model-dropdown"
              className="block w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-200 ease-in-out"
              value={selectedModel}
              onChange={handleModelChange}
            >
              {models.map((model: Model, index: number) => (
                <option key={index} value={model.id}>{model.id}</option>
              ))}
            </select>
          </div>
          <div className="w-2/3 mb-4">
            <input
              className="w-full rounded-lg border-gray-300 border p-4 h-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
              placeholder="Enter your text"
              value={inputText}
              onChange={handleInputChange}
            />
          </div>
          <button
            className={`w-2/3 rounded-lg py-2 shadow-lg transition duration-150 ease-in-out text-lg font-bold
              ${!inputText || isLoading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
            onClick={getCompletionsResponse}
            disabled={!inputText || isLoading} // Disable the button if inputText is empty or if it's loading
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Loading Response...
              </div>
            ) : (
              "Get Response"
            )}
          </button>
          <div className="mt-4 px-6 py-4 w-2/3 mx-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-md transition duration-200 ease-in-out">
            <p className="text-lg leading-relaxed font-light">
              {message || "Your response will appear here..."}
            </p>
          </div>
        </>
      ) : (
        // If API Key is not created show this component to login through OpenRouter
        <>
          <div className="w-full text-center border-b border-gray-300 bg-gradient-to-b from-white to-gray-100 pb-8 pt-10 backdrop-blur-lg dark:border-neutral-700 dark:bg-gray-900/80 dark:from-gray-800/80 lg:rounded-xl lg:border lg:p-6 lg:dark:bg-gray-800/80">
            <p className='text-[green-800] dark:text-gray-200 text-lg font-light leading-relaxed mx-4'>
              Use OpenRouter OAuth to get instant access to all OpenRouter Models with a quick log-in.
            </p>
            
            <div className="mt-8 w-full flex justify-center">
              <button
                className="w-1/3 flex items-center justify-center rounded-md bg-gray-300 text-[#19f200] py-3 px-6 hover:bg-gray-200 shadow-md transition duration-200 ease-in-out font-semibold"
                onClick={() => openRouterAuth()}
              >
                <Image src="/favicon-16x16.png" alt="OpenRouter Logo" width="20" height="20" className="mr-2" /> Log In To OpenRouter
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}