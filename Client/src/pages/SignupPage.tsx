import SignupLayout from "../features/SingupLayout/SignupLayout";

export default function SignupPage() {
  return <SignupLayout />;
}

// programatic and operational errors
// programtic su greske koje nastaju zbog gresaka u mom kodu
// operational greske su greske koje nastaju zbog faktora na koje ne mogu kodom da uticem, ali je kod ispravan

// programatic greske ne prikazujem korisniku, dok operational prikazujem
// sa catchAsync hvatam programatic greske i vracam generic poruku (Something went wrong...)
// sa operational errors saljem direktnu poruku da se zna sta je greska
