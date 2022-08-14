import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import Renderer from "./Renderer";
import { useMain } from "./Main";
import { upload } from "./upload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import { useIPFS, useIPFSText } from "./useIPFS";
const example: string = `
# Title

## Second Title

### Third Title

#### Fourth title

*italics are between stars*

**bold is between double-stars**

\`technical jargon is between back-ticks\`

1. enumerate using numbers at the front
2. of a line
    1. and indent with four spaces for nested lists
    1. like this one

* Bullet points come after a leading star
* and you and add as many as you like



    block quote comes from four leading spaces on the paragraph



(extra lines between paragraphs are ignored)

And put terms you want to use in the document between {{curly braces}}


`;
const Editor: FC = () => {
  const [terms, setTerms] = useState<Record<string, string>>({});
  const { templateId, subpath1, subpath2, subpath3 } = useParams();
  const combinedPath = [templateId, subpath1, subpath2, subpath3]
    .filter(Boolean)
    .join("/");
  const ipfsText = useIPFSText(combinedPath);
  console.log("I would get from IPFS", combinedPath);
  useEffect(() => {
    if (ipfsText) {
      console.log("IPFSText is ", ipfsText);
    }
  }, [ipfsText]);
  const initialDoc = ipfsText || example;
  const addTerm = useCallback((newTerm: string) => {
    setTerms((old) => {
      if (old[newTerm]) return old;
      return { ...old, [newTerm]: newTerm };
    });
  }, []);
  const { setTitle } = useMain();
  useEffect(() => {
    setTitle("Editor");
  }, []);
  if (combinedPath && !ipfsText) return null;
  return (
    <Fragment>
      <Formik
        initialValues={
          { template: initialDoc, terms: {} } as {
            template: string;
            terms: Record<string, string>;
          }
        }
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          setSubmitting(false);
        }}
      >
        {({ values }) => (
          <Form>
            <div className="flex w-full flex-row justify-between space-x-12">
              <div className="flex-1 w-1/2 flex-col ">
                <div className="doc-shadow p-6 bg-white">
                  <h2 className="text-2xl font-bold mb-4">Template Editor</h2>
                  <Field
                    as="textarea"
                    name="template"
                    className="scrollable form-textarea w-full min-h-40 border-gray-300"
                    rows={20}
                  />
                  <div className="flex justify-end mt-6">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={async () => {
                        console.log("Hello there my friend");
                        toast("Uploading");
                        const cidWithPath = await upload(values.template);
                        toast("Successfully uploaded" + cidWithPath);
                        console.log("uploaded", cidWithPath);
                        localStorage.setItem("currentTemplate", cidWithPath);
                        const templates: Record<string, string> = JSON.parse(
                          localStorage.getItem("templates") || "{}"
                        );
                        templates[cidWithPath] = values.template;
                        console.log(
                          "I will save templates",
                          JSON.stringify(templates)
                        );
                        localStorage.setItem(
                          "templates",
                          JSON.stringify(templates)
                        );
                      }}
                    >
                      Upload to IPFS
                    </button>
                  </div>
                </div>

                <div>
                  {terms && (
                    <div className=" p-4 m-2 bg-white doc-shadow  mt-12">
                      <h2 className="text-2xl font-bold">
                        Terms Used in this document
                      </h2>
                      {Object.entries(terms).map(([key, value]) => (
                        <div>
                          <label
                            className="text-gray-800 font-medium text-xs"
                            htmlFor={`terms.${key}`}
                          >
                            {key}
                          </label>
                          <div>
                            <Field
                              type="text"
                              name={`terms.${key}`}
                              class="field w-full border border-gray-400"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 w-1/2 flex-col px-4">
                <h2 className="text-2xl font-bold mb-4">Preview</h2>
                <Renderer
                  addTerm={addTerm}
                  template={values.template}
                  terms={Object.entries(values.terms)
                    .map(([key, value]) => [
                      key,
                      `**${value || key + " NOT DEFINED"}**`,
                    ])
                    .reduce(
                      (acc, [key, value]) => ({ ...acc, [key]: value }),
                      {}
                    )}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
export default Editor;
