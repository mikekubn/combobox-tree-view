"use client";

import { Controller, useForm } from "react-hook-form";
import ComboboxTreeView, { options } from "../ComboboxTreeView";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const schema = yup.object({
  options: yup
    .array()
    .min(1, () => "Rrequired")
    .nullable()
    .required(() => "Rrequired"),
});

type FormType = yup.InferType<typeof schema>;

interface DataProp {
  id: string;
  name: string;
}

const Form = (): React.ReactElement => {
  const {
    control,
    clearErrors,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      options: [],
    },
  });

  const onSubmit = () => {
    reset();
  };

  return (
    <form
      id="combobox-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col w-full md:w-2/3 mt-10"
    >
      <Controller
        name="options"
        control={control}
        rules={{
          required: true,
          onChange: (): void => clearErrors("options"),
        }}
        defaultValue={[]}
        render={({ field }): React.ReactElement => (
          <ComboboxTreeView
            {...field}
            search
            options={options(10)}
            id="options"
            className="mb-3 w-full"
            error={errors.options?.message}
          />
        )}
      />
      <div className="mt-4 flex flex-1 flex-row justify-end">
        <button
          type="submit"
          className="w-44 p-4 rounded-xl border-blue shadow-xl text-primary hover:bg-shadow/10"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
