import { Controller, useController } from "react-hook-form";

export const LabeledInput = ({ label, type, name, placeholder = "", errMsg = "", className = "", handler }) => {
  const { field } = useController({ name: name, control: handler });

  return (
    <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 md:items-start">
      <label htmlFor={name} className="text-[13px] sm:text-sm font-semibold text-gray-800 w-full md:w-1/3 cursor-pointer md:mt-1.5">
        {label} :
      </label>

      <div className="w-full md:w-2/3 flex flex-col gap-0.5">
        <input
          type={type}
          id={name}
          {...field}
          placeholder={placeholder}
          className={`w-full border border-gray-400 rounded focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none py-1 px-2 bg-gray-50 text-[13px] sm:text-sm transition-all shadow-sm ${className}`}
        />
        {errMsg && <span className="text-[11px] sm:text-xs text-red-600 italic leading-tight transition-all">{errMsg}</span>}
      </div>
    </div>
  );
};

export const SelectInput = ({ label, name, handler, errMsg, options }) => {
  return (
    <div className="w-full flex flex-col md:flex-row gap-1 md:gap-2 md:items-start">
      <label htmlFor={name} className="text-[13px] sm:text-sm font-semibold text-gray-800 w-full md:w-1/3 cursor-pointer md:mt-1.5">
        {label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()} :
      </label>

      <div className="w-full md:w-2/3 flex flex-col gap-0.5">
        <Controller
          name={name}
          control={handler}
          render={({ field }) => {
            return (
              <>
                <select
                  id={name}
                  {...field}
                  className={`w-full border border-gray-400 rounded focus:ring-1 focus:ring-emerald-700 focus:border-emerald-700 outline-none py-1 px-2 bg-gray-50 text-[13px] sm:text-sm transition-all shadow-sm cursor-pointer`}
                >
                  <option value="">--Select Any One--</option>
                  {options &&
                    options.map((val, idx) => {
                      return (
                        <option key={idx} value={val.value}>
                          {val.label}
                        </option>
                      );
                    })}
                </select>
                {errMsg && <span className="text-[11px] sm:text-xs text-red-600 italic leading-tight transition-all">{errMsg}</span>}
              </>
            );
          }}
        />
      </div>
    </div>
  );
};
