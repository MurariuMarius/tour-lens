const ROOT_URL = "https://tour-lens-ml-455665426558.us-central1.run.app";

const predict = async (image, modelId) => {
  try {
    const response = await fetch(`${ROOT_URL}/predict?id=${modelId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    });

    const body = await response.json();

    console.log(body)

    return body;
  } catch {
    new Error("Classification error");
  }
};

export {
  predict
};
