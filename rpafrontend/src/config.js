const config = 
{
    "url": process.env.NODE_ENV === 'production' 
        ? "https://rpa-olive.vercel.app"  // Your Vercel backend URL
        : "http://localhost:2021"
}

export default config;
//https://rpa-olive.vercel.app
//http://localhost:2021
