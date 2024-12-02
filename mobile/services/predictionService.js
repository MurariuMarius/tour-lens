const ROOT_URL = "http://10.0.2.2:5000";

const predict = async (image) => {
  try {
    const response = await fetch(`${ROOT_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    });

    const body = await response.text();

    console.log(body)

    return body;

  } catch {
    new Error("Classification error");
  }
};

export {
  predict
};
