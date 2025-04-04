import { Control, Controller, FieldError } from "react-hook-form";

interface Props {
    name: string,
    label: string,
    type?: string,
    control: Control<any>
    error?: FieldError
}

const InputForm = ({ name, control, label, type, error }: Props) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input id={name} type={type} {...field} className={`form-control ${error ? "is-invalid" : ""}`} />
        )}
      />
      <p className="error" style={{ minHeight: "1.25rem", margin: 0 }}>
        {error?.message || ""}
      </p>
    </div>
  );
}

export default InputForm;
