import './App.css';
import React, { useRef, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as htmlToImage from "html-to-image";

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const App: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    if (formRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(formRef.current);
        setBase64Image(dataUrl);
        await navigator.clipboard.writeText(dataUrl);
        alert("Screenshot copied to clipboard!");
      } catch (error) {
        console.error("Error converting to base64 or copying:", error);
      }
    }
  };

  const handleCopy = async () => {
    if (base64Image) {
      try {
        await navigator.clipboard.writeText(base64Image);
        alert("Base64 image copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy text to clipboard:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Formik Form Screenshot to Base64</h1>
      <Formik
        initialValues={{ name: "", email: "", password: "", confirmPassword: "" }}
        validate={(values) => {
          const errors: Partial<FormValues> = {};
          if (!values.name) errors.name = "Required";
          if (!values.email) errors.email = "Required";
          if (!values.password) errors.password = "Required";
          if (!values.confirmPassword) errors.confirmPassword = "Required";
          else if (values.password !== values.confirmPassword) errors.confirmPassword = "Passwords must match";
          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <div ref={formRef}>
            <Form className="form">
              <div className="form-group">
                <label htmlFor="name" className="label">Name:</label>
                <Field type="text" name="name" className="input" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="label">Email:</label>
                <Field type="email" name="email" className="input" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="label">Password:</label>
                <Field type="password" name="password" className="input" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="label">Confirm Password:</label>
                <Field type="password" name="confirmPassword" className="input" />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>

              <button type="submit" disabled={isSubmitting} className="button">
                Submit and Copy Screenshot
              </button>
            </Form>
          </div>
        )}
      </Formik>

      {base64Image && (
        <div className="output-container">
          <h2 className="output-heading">Base64 Screenshot:</h2>
          <textarea
            value={base64Image}
            readOnly
            className="textarea"
          />
          <button onClick={handleCopy} className="copy-button">
            Copy Base64 Image
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
