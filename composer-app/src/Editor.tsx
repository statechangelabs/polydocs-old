import { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Formik, Form, Field, validateYupSchema } from "formik";
import Renderer from "./Renderer";
import { useMain } from "./Main";
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
  return (
    <Fragment>
      <Formik
        initialValues={
          { template: example, terms: {} } as {
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
            <div className="flex w-full flex-row justify-between">
              <div className="flex-1 w-1/2 flex-col ">
                <Field
                  as="textarea"
                  name="template"
                  className="form-textarea w-full min-h-40"
                />
                <div>
                  {terms && (
                    <div className="border-2 p-4 m-2 bg-pink-200 border-purple-800 rounded-md">
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
                              class="field"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 w-1/2 flex-col">
                <Renderer
                  addTerm={addTerm}
                  template={values.template}
                  terms={values.terms}
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
