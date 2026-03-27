import { Link } from "react-router-dom";

const WorkInProgress = ({title="Under Construction", description = "We are working hard to bring this feature to you."}) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-white px-4 py-8 text-center">
      <div className="max-w-3xl w-full">
        <h1 className="mb-4 text-[clamp(.75rem,6vw,5rem)] font-black leading-tight tracking-tight text-slate-900">{title}</h1>

        <div className="flex items-center justify-center gap-3">
          <h2 className="text-[clamp(1rem,3vw,1.5rem)] font-bold text-slate-600">Work In Progress</h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500 [animation-delay:200ms]"></div>
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500 [animation-delay:400ms]"></div>
          </div>
        </div>

        <p className="mx-auto my-6 max-w-[35ch] text-[clamp(1rem,2.5vw,1.25rem)] font-medium text-slate-600">
          {description}
        </p>

        <Link
          to="/user"
          className="inline-block rounded-lg bg-slate-900 px-8 py-3 text-base font-bold text-white shadow-md transition-all hover:bg-slate-800 active:scale-95"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default WorkInProgress;
