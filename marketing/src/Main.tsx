import Logo from "./PolydocsLogo.svg";
import Topography from "./topography.svg";
import ShieldGraphic from "./shieldServer.svg";
import Check from "./check.svg";
import TopoSquare1 from "./topographySquare-01.svg";
import TopoSquare2 from "./topographySquare-02.svg";
import Lock from "./lock.svg";
import Shield from "./shield.svg";
import Community from "./community.svg";

const Renderer = () => {
  return (
    <>
      <div className="absolute w-full z-50 px-6 lg:px-0">
        <header className="container mx-auto top-0 w-full flex justify-between items-center py-6">
          <div className="flex items-center">
            <img src={Logo} className="w-12 mr-4" />
            <p className="text-white text-3xl font-medium">Polydocs</p>
          </div>
          <nav>
            <a
              href="https://admin.polydocs.xyz"
              className="btn btn-gradient text-white"
            >
              Sign In
            </a>
          </nav>
        </header>
      </div>

      <main>
        <section className="relative bg-gradient-radial to-black from-primary-dark overflow-hidden z-40">
          <div className="flex justify-center items-center h-screen px-6 lg:px-0">
            <div className="relative text-center z-40">
              <p className="mb-4 text-xl text-teal-light tracking-widest">
                More than just tokens
              </p>
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8">
                Smart Documents for <br />
                Smart Contracts
              </h1>
              <p className="lg:text-lg text-white opacity-75 max-w-xl mx-auto mb-8">
                The only standard to build trust and mutual consent in your
                dapps through cryptographically confirmed, gasless signed
                agreements
              </p>
              <a href="https://admin.polydocs.xyz" className="btn btn-primary">
                Make a Contract
              </a>
            </div>

            <img
              src={Topography}
              className="absolute w-full h-full object-cover opacity-5"
            />
          </div>
        </section>

        <div className="relative container-narrow my-24 lg:my-40 overflow-hidden py-5 px-6 lg:px-0">
          <img
            className="absolute w-3/4 lg:w-1/2 transform -translate-y-6"
            src={TopoSquare1}
            alt=""
          />
          <section className="relative grid lg:grid-cols-5 gap-12">
            <h2 className="lg:col-span-2 h2 text-primary-default">
              There are no simple assets
            </h2>
            <p className="lg:col-span-3 text-xl leading-relaxed opacity-75">
              Whether you are deploying decentralized finance, non-fungible
              tokens, or decentralized autonomous organizations, every situation
              is different and requires special attention.{" "}
            </p>
          </section>
        </div>

        <section className="container-narrow my-24 lg:my-40 px-6 lg:px-0">
          <div className="grid lg:grid-cols-6 gap-12 items-center">
            <div className="lg:hidden w-3/5 mx-auto">
              <img
                src={ShieldGraphic}
                alt="A shield graphic sits in front of a server graphic indicating security"
              />
            </div>
            <div className="flex flex-col space-y-6 lg:col-span-4">
              <h2 className="text-xl lg:text-2xl font-bold">
                Trust is Everything - bring mutual consent to all your use cases
              </h2>

              <div className="flex items-center space-x-6">
                <p className="text-primary-light whitespace-nowrap">
                  Use cases
                </p>
                <hr className="w-full" />
              </div>

              <ul className="grid lg:grid-cols-2 gap-y-4">
                <li className="flex space-x-3">
                  <img src={Check} alt="A stylized checkmark" />
                  <p className="text-sm">
                    Unlimited collections &amp; submissions!
                  </p>
                </li>
                <li className="flex space-x-3">
                  <img src={Check} alt="A stylized checkmark" />
                  <p className="text-sm">
                    Open, close, &amp; schedule your books
                  </p>
                </li>
                <li className="flex space-x-3">
                  <img src={Check} alt="A stylized checkmark" />
                  <p className="text-sm">Reference photo collection</p>
                </li>
                <li className="flex space-x-3">
                  <img src={Check} alt="A stylized checkmark" />
                  <p className="text-sm">Instant search and filtering</p>
                </li>
              </ul>
            </div>

            <div className="hidden lg:block col-span-2">
              <img
                src={ShieldGraphic}
                alt="A shield graphic sits in front of a server graphic indicating security"
              />
            </div>
          </div>
        </section>

        <section className="relative container-narrow my-24 lg:my-40 px-6 lg:px-0">
          <div className="transform -translate-y-10">
            <img className="absolute w-2/5" src={TopoSquare1} alt="" />
            <img className="absolute w-2/5 right-0" src={TopoSquare2} alt="" />
          </div>

          <div className="relative flex flex-col justify-center z-40">
            <h2 className="h2 text-primary-default text-center max-w-3xl mx-auto mb-6">
              Make your first Agreement- Protected Contract - For Free!
            </h2>
            <div className="mx-auto">
              <a href="https://admin.polydocs.xyz" className="btn btn-primary">
                Start Now
              </a>
            </div>
          </div>
        </section>

        <section className="relative container-narrow my-24 lg:my-40 px-6 lg:px-0">
          <div className="relative grid lg:grid-cols-3 gap-12">
            <div className="flex flex-col gap-4">
              <img className="mr-auto h-12" src={Shield} alt="" />
              <h2 className="font-semibold text-primary-default text-2xl">
                Protect Your Rights
              </h2>
              <div className="h-0.5 bg-teal-light w-1/3" />
              <p className="opacity-75">
                Ensuring that your customers agree to the terms of a product
                creates trust and clarity in both directions. This is a much
                stronger footing for doing business and protecting your legal
                rights in the event of dispute.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <img className="mr-auto h-12" src={Lock} alt="" />
              <h2 className="font-semibold text-primary-default text-2xl">
                Cryptographic Safety
              </h2>
              <div className="h-0.5 bg-teal-light w-1/3" />
              <p className="opacity-75">
                Whether directly signing or using our gasless sign.polydocs.xyz
                service, your customers know exactly which version of the
                document they have signed. There’s no question of what was on
                the paper at the time - that’s the immutable nature of
                blockchain and IPFS!
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <img className="mr-auto h-12" src={Community} alt="" />
              <h2 className="font-semibold text-primary-default text-2xl">
                Join the Community
              </h2>
              <div className="h-0.5 bg-teal-light w-1/3" />
              <p className="opacity-75">
                You don’ thave to make your own agreements. Use a template and
                fill in just the terms that apply to your organization. Fewer
                custom agreements mean more trust.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col justify-center items-center my-20 px-6 lg:px-0">
        <div className="flex items-center mb-4">
          <img src={Logo} className="w-12 mr-4" />
          <p className="text-3xl font-semibold">Polydocs</p>
        </div>
        <p className="text-xs opacity-50">
          Statechange Labs &copy; 2022 | All rights reserved
        </p>
      </footer>
    </>
  );
};
export default Renderer;
