import { Mail, Phone } from "lucide-react";
import React from "react";

export default function ImprintPage() {
    return (
        <main className="max-w-3xl mx-auto my-auto p-10 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-md shadow-md text-gray-800">
            <h1 className="text-center mb-8 text-4xl font-extrabold tracking-tight text-gray-900">Impressum</h1>
            <section className="mb-10">
                <h2 className="text-xl mb-3 font-semibold text-gray-700 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" /> Angaben gemäß § 5 DDG
                </h2>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 rounded-full p-3">
                            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" fill="#3B82F6" />
                                <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#fff" fontFamily="sans-serif">KG</text>
                            </svg>
                        </div>
                        <address className="not-italic">
                            <span className="block font-medium text-lg">Konstantin Götz</span>
                            <span className="block text-gray-600">Seehofstraße 3, 14169 Berlin</span>
                        </address>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Vertreten durch:</span>
                        <span className="text-gray-600">Konstantin Götz</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">Kontakt:</span>
                        <ul className="ml-2 mt-2 flex flex-col gap-1">
                            <li className="flex items-center gap-2">
                                <Phone size={20} className="text-green-500" />
                                <a
                                    href="tel:+4915736664088"
                                    className="text-blue-600 hover:text-blue-800 underline transition"
                                >
                                    +49 1573 6664088
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={20} className="text-blue-500" />
                                <a
                                    href="mailto:konst2037@gmail.com"
                                    className="text-blue-600 hover:text-blue-800 underline transition"
                                >
                                    konst2037@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-700">
                            Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
                        </span>
                        <address className="not-italic text-gray-600">
                            <p>Konstantin Götz</p>
                            <p>Seehofstraße 3</p>
                            <p>14169 Berlin</p>
                        </address>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl mb-3 font-semibold text-gray-700 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" /> Haftungsausschluss
                </h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Haftung für Inhalte</h3>
                        <p className="leading-relaxed">
                            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
                            Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir
                            gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                            verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet,
                            übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
                            forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder
                            Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
                            Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
                            Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir
                            diese Inhalte umgehend entfernen.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Haftung für Links</h3>
                        <p className="leading-relaxed">
                            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss
                            haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                            Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
                            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente
                            inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer
                            Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
                            Links umgehend entfernen.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mb-10">
                <h2 className="text-xl mb-3 font-semibold text-gray-700 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" /> Urheberrecht
                </h2>
                <p className="leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem
                    deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
                    außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen
                    Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht
                    kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
                    wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche
                    gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
                    wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir
                    derartige Inhalte umgehend entfernen.
                </p>
            </section>

            <section>
                <h2 className="text-xl mb-3 font-semibold text-gray-700 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full" /> Datenschutz
                </h2>
                <div className="space-y-4">
                    <p className="leading-relaxed">
                        Die Nutzung unserer Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich.
                        Soweit auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder eMail-Adressen) erhoben werden, erfolgt dies, soweit möglich, stets auf freiwilliger Basis. Diese Daten
                        werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
                    </p>
                    <p className="leading-relaxed">
                        Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann. Ein lückenloser Schutz der Daten vor dem Zugriff durch
                        Dritte ist nicht möglich.
                    </p>
                    <p className="leading-relaxed">
                        Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten durch Dritte zur
                        Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird
                        hiermit ausdrücklich widersprochen. Die Betreiber der Seiten behalten sich ausdrücklich rechtliche
                        Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-Mails, vor.
                    </p>
                </div>
            </section>
        </main>
    );
}
