# Tour-Lens 📸🗺️

**Discover the world, one landmark at a time! 👀**

A mobile application that identifies landmarks from the photos you take, presents detailed information about each one and also helps you get there. 🧭

---

### Overview 🔭

**Tour-Lens** is a React Native application that allows you to take a picture of a landmark, and if recognised, the app will display information about it. Each supported city has multiple landmarks, and administrators can add new ones to the database, complete with training images.

---

### Features ✨

- **Identify Landmarks**: Take a photo of a landmark and get information about it such as the name, background, and location. Simply click a link to open Google Maps and find out how to get there.
- **Multiple Cities/Attractions**: You can select multiple supported destinations around the world.
- **Admin Tools**:
  - Add cities with associated landmarks.
  - Upload landmark details with at least 10 training photos.
- **Custom AI Model**: A specialised microservice handles the fine-tuning of deep learning model from a pre-trained **Vision Transformer**.

---

### Architecture 🎯

1. **React Native**
   - Allows users to select a city and view the available landmarks and information about them.
   - For the selected city, the user can take a picture of a landmark and receive information about it.
   - Sends photos to the cloud microservice for landmark recognition.

2. **Firebase Services**
   - Authenticate users using Firebase Authentication.
   - Store user and landmark data in Firestore.
   - Dedicated Firebase cloud function for adding new cities / landmarks.

3. **Google Cloud Machine Learning Container**
   - Specialised microservice for training an ML model tailored for each city.
   - Fine-tunes a Vision Transformer model using the provided images.
   - Sends the image recongnition results to the mobile app.
  
  ---
  ### Licence 📄
  
Distributed under the MIT Licence. See [LICENCE](LICENCE) for more information.
