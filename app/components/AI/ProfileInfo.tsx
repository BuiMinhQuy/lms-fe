import React, { FC, useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
    avatar: string | null;
    user: any;
};

const ProfileInfo: FC<Props> = ({ user, avatar }) => {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(
                "https://lms-0g6w.onrender.com/api/v1/generateText",
                { prompt },
                { withCredentials: true }
            );
            setResponse(res.data.message);
            //console.log(res.data.message);
        } catch (err) {
            setError("An error occurred while fetching the data.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {}, [content]);
    //console.log("content", content);

    return (
        <>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full pl-6 800px:pl-10">
                    <div className="min-h-screen flex items-center justify-center bg-gray-100">
                        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                            <h1 className="text-2xl font-bold mb-4">Generate Text</h1>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="prompt" className="block text-gray-700 font-bold mb-2">
                                        Prompt:
                                    </label>
                                    <input
                                        type="text"
                                        id="prompt"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="w-full px-3 py-2 border rounded text-black"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white px-3 py-2 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Generating..." : "Generate"}
                                </button>
                            </form>
                            {error && <p className="mt-4 text-red-500">{error}</p>}
                            {response && (
                                <div className="mt-4 bg-gray-100 p-4 rounded">
                                    <h2 className="text-xl text-black font-bold mb-2">Response:</h2>
                                    <ReactMarkdown className="text-black">{response}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                    <br />
                </div>
            </div>
            <br />
            <br />
        </>
    );
};

export default ProfileInfo;
