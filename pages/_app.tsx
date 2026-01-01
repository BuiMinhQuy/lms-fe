import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
    //console.log(" process.env.GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET);
    return <Component {...pageProps} />;
}
