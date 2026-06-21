import css from "./NoteForm.module.css";
import { Field, Form, Formik, type FormikHelpers, ErrorMessage, } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../lib/api";
import { useId } from "react";

interface NoteFormProps {
  onCancel: () => void;
}
export interface NoteFormValues {
  title: string;
  content: string;
  tag: string;
}

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};
const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),

  content: Yup.string().max(500, "Content is too long"),

  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>,
  ) => {
    mutate(values);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={NoteSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-title`}>Title</label>

            <Field
              id={`${fieldId}-title`}
              name="title"
              type="text"
              className={css.input}
            />

            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-content`}>Content</label>

            <Field
              as="textarea"
              id={`${fieldId}-content`}
              name="content"
              rows={8}
              className={css.textarea}
            />

            <ErrorMessage
              name="content"
              component="span"
              className={css.error}
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor={`${fieldId}-tag`}>Tag</label>

            <Field
              as="select"
              id={`${fieldId}-tag`}
              name="tag"
              className={css.select}
            >
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>

            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>

            <button
              type="submit"
              className={css.submitButton}
              disabled={isPending || !isValid}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}