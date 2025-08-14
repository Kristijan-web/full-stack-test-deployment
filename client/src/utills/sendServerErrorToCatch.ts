// fetchData treba da bude promise

async function sendServerErrorToCatch(fetchData: Response) {
  const errorResponse = await fetchData.json();
  const error = new Error("Something went wrong...");
  error.responseData = errorResponse;
  throw error;
}

export default sendServerErrorToCatch;
