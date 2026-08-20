import { useGetUserDetailsQuery } from "./Dashboard/overpageApiSlice";
import "../../../theme.css";

const Detail = ({ label, value }) => (
  <div className="min-w-0 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-secondary)] px-4 py-3">
    <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
      {label}
    </dt>
    <dd className="mt-1 truncate text-sm font-medium text-[var(--text)]">
      {value || "Not provided"}
    </dd>
  </div>
);

export default function ProfilePage() {
  const { data, isLoading, isError, error, refetch } = useGetUserDetailsQuery();
  const user = data?.data || data?.result || data || {};
  const name = user.name || user.fullName || "Your profile";
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const avatar = user.profilePhoto || user.avatar || user.image || user.photo;
  const location = [user.city, user.state, user.country].filter(Boolean).join(", ");

  if (isLoading) {
    return (
      <div className="profile-page flex h-full min-h-[360px] items-center justify-center p-5">
        <div className="w-full max-w-lg animate-pulse rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="h-16 w-16 rounded-full bg-[var(--background-secondary)]" />
          <div className="mt-5 h-5 w-1/2 rounded bg-[var(--background-secondary)]" />
          <div className="mt-3 h-4 w-3/4 rounded bg-[var(--background-secondary)]" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="profile-page flex h-full min-h-[360px] items-center justify-center p-5">
        <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--danger)] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-sm)]">
          <h1 className="font-[var(--font-heading)] text-xl font-bold text-[var(--heading)]">Unable to load profile</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{error?.data?.message || "Please try again in a moment."}</p>
          <button type="button" onClick={refetch} className="mt-5 rounded-[var(--radius-sm)] bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:bg-[var(--primary-hover)]">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <main className="profile-page h-full min-h-0 overflow-y-auto">
      <div className="profile-page__content px-5 py-6 sm:px-8 sm:py-8">
        <header className="profile-page__header rounded-[var(--radius-lg)] px-5 py-6 shadow-[var(--shadow-sm)] sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              {avatar ? <img src={avatar} alt="" className="h-16 w-16 shrink-0 rounded-full border-2 border-[var(--gold)] object-cover sm:h-20 sm:w-20" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-[var(--gold)] bg-[var(--background-secondary)] font-[var(--font-heading)] text-xl font-bold text-[var(--primary)] sm:h-20 sm:w-20 sm:text-2xl">{initials || "U"}</div>}
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--gold)]">Client account</p>
                <h1 className="mt-1 truncate font-[var(--font-heading)] text-2xl font-bold text-[var(--heading)] sm:text-3xl">{name}</h1>
                <p className="mt-1 truncate text-sm text-[var(--muted)]">{user.email || "Keep your account details up to date."}</p>
              </div>
            </div>
            <span className="w-fit rounded-full border border-[var(--success)] px-3 py-1.5 text-xs font-semibold text-[var(--success)]">Account active</span>
          </div>
        </header>

        <section className="profile-page__section mt-5" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="font-[var(--font-heading)] text-lg font-bold text-[var(--heading)]">Contact details</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">The details professionals use when responding to your projects.</p>
          <dl className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Detail label="Email address" value={user.email} />
            <Detail label="Phone number" value={[user.countryCode, user.phone || user.phoneNumber].filter(Boolean).join(" ")} />
            <Detail label="Location" value={location || user.address} />
          </dl>
        </section>

        <section className="profile-page__section mt-4" aria-labelledby="about-heading">
          <h2 id="about-heading" className="font-[var(--font-heading)] text-lg font-bold text-[var(--heading)]">About you</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[var(--text)]">{user.bio || user.about || "Add a short introduction in your account settings to help professionals understand your project goals."}</p>
        </section>
      </div>
    </main>
  );
}
