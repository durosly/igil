export default function AdminNewProgramLoading() {
	return (
		<div>
			<div className="skeleton mb-6 h-10 max-w-[12rem] rounded-md" aria-hidden />

			<form className="">
				<div className="gap-6">
					<fieldset className="fieldset w-full">
						<div className="skeleton h-4 w-12 mb-2" aria-hidden />
						<div className="skeleton h-10 w-full rounded-field" aria-hidden />
					</fieldset>

					<fieldset className="fieldset w-full">
						<div className="skeleton h-4 w-24 mb-2" aria-hidden />
						<div className="skeleton h-24 w-full rounded-lg" aria-hidden />
					</fieldset>

					<fieldset className="fieldset w-full">
						<div className="skeleton h-4 w-24 mb-2" aria-hidden />
						<div className="skeleton aspect-video w-full max-w-md rounded-lg" aria-hidden />
					</fieldset>

					<fieldset className="fieldset w-full">
						<div className="skeleton h-4 w-40 mb-2" aria-hidden />
						<div className="skeleton h-20 w-full rounded-lg" aria-hidden />
					</fieldset>

					<fieldset className="fieldset w-full">
						<div className="skeleton h-4 w-14 mb-2" aria-hidden />
						<div className="skeleton h-10 w-full rounded-field" aria-hidden />
					</fieldset>

					<div className="card-actions justify-end gap-2 pt-2">
						<div className="skeleton h-10 w-20 rounded-field" aria-hidden />
						<div className="skeleton h-10 w-24 rounded-field" aria-hidden />
					</div>
				</div>
			</form>
		</div>
	);
}
