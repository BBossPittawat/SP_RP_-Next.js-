'use client'

export default function Footer() {
  return (
    <>

      <footer className="footer footer-center p-4 text-gray-500">
        <aside>
          <p>MT200 DX TEAM {process.env.NEXT_PUBLIC_VERSION}</p>
        </aside>
      </footer>

    </>
  )
}
