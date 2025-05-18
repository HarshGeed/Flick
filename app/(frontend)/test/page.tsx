export default function Test() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const text = formData.get("text");
    console.log("Submitted text:", text);
  };

  return (
    <>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            name="text"
            rows={4}
            placeholder="Enter your text here..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

// #3b343c
// #f2c530