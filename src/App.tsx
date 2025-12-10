import {Button} from "./components/ui/button.tsx";
import {Header} from "./components/Header.tsx";
import {useNavigate} from "react-router-dom";

function App() {
    const navigate = useNavigate();

  return (
      <div className="min-h-screen bg-[#f9f4ee] text-[#4b2e23]">
          <Header />
          <section className="max-w-6xl mx-auto px-4 mt-6">
              <div className="rounded-2xl bg-[#e5d7c5] p-10 shadow-sm">
                  <h1 className="text-3xl font-bold mb-3">
                      Плануйте мандрівки природно.
                  </h1>
                  <p className="text-lg mb-6">
                      Зберіть власний маршрут за кілька кроків у теплій, коричневій темі.
                  </p>

                  <Button
                      className="bg-[#5e3d2b] hover:bg-[#4b2e23] text-white px-6 py-4 text-lg rounded-full"
                      onClick={() => navigate('/wizard')}
                  >
                      Створити маршрут
                  </Button>
              </div>
          </section>

          {/* Steps */}
          <section className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  { title: "Крок 1", desc: "Оберіть напрям · додайте точки · експортуйте PDF" },
                  { title: "Крок 2", desc: "Оберіть напрям · додайте точки · експортуйте PDF" },
                  { title: "Крок 3", desc: "Оберіть напрям · додайте точки · експортуйте PDF" },
              ].map((item, i) => (
                  <div
                      key={i}
                      className="rounded-2xl bg-[#e5d7c5] p-6 shadow-sm"
                  >
                      <div className="font-semibold text-lg italic">{item.title}</div>
                      <p className="text-sm mt-1">{item.desc}</p>
                  </div>
              ))}
          </section>

          {/* Footer */}
          <footer className="max-w-6xl mx-auto px-4 py-12 text-sm text-gray-600">
              © 2025 Маршрутизатор
          </footer>
      </div>
  )
}

export default App
