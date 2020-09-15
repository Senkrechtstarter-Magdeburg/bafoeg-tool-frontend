import {buildQuestionary, defineBlock, QuestionBuilder, QuestionContext} from "@shared/builder";
import {DisplayType, Question, QuestionEntry} from "@models/questions";
import {PDF_FORMS} from "@questions/pdfForms";
import {formatBool, formatBoolNeg, formatDateFull, isValidIBANNumber} from "@questions/questionHelper";



import universities from "./autocomplete/universities.json";
import countries from "./autocomplete/countries.json";
import {AutocompleteOption} from "@models/questions/autocompleteQuestion";
import {isAutocompleteOptionValidator} from "@shared/builder/validators";


export enum Gender {
  Male,
  Female,
}

export enum Phase {
  School = 1,
  Uni = 2,
  Practical = 3
}

export type BlockArgs<T extends string> = {
  form: { [k in T]: string };
  formAlias: FormAliases;
  hints?: { [k in T]?: boolean };
  defaults?: { [k in T]?: QuestionEntry["defaultValue"] };
  hideIf?: (ctx: QuestionContext) => boolean
} | {
  form: { [k in T]: string };
  formAlias: FormAliases;
  hints?: { [k in T]?: boolean };
  defaults?: { [k in T]?: QuestionEntry["defaultValue"] };
  showIf?: (ctx: QuestionContext) => boolean
}

export const askForAddress = defineBlock("address",
  (builder,
   args: BlockArgs<"address" | "zip" | "city" | "country" | "state">) => {

    args = {hints: {country: true, ...args.hints}, defaults: {country: () => "DE", ...args.defaults}, ...args};

    const builderCallback = (name: string) => <T extends QuestionBuilder<Question, FormAliases>>(f: T) => {
      if (name !== "address") {
        f.hideText();
      }

      f.withFormName(args.formAlias, args.form[name]);
      if (args.hints[name]) {
        f.showHint();
      }

      if (args.defaults && args.defaults[name]) {
        f.defaultTo(args.defaults[name]);
      }

      if ("hideIf" in args) {
        f.hideIf(args.hideIf);
      }

      if ("showIf" in args) {
        f.showIf(args.showIf);
      }

      return f;
    };
    for (const name of ["address", "zip", "city", "state"]) {
      builder.askText(name, builderCallback(name));
    }

    builder.askAutocompleteQuestion("country", f => {
      const val = countries.map(key => ({value: key, title: {translateKey: `app.autocomplete.countries.${key}`}} as AutocompleteOption));
      f.option(...val);
      f.valid(isAutocompleteOptionValidator());

      return builderCallback("country")(f);
    });

    return builder;
  }
);

export const cvEntry = defineBlock("cvEntry",
  (builder, args: BlockArgs<"work" | "city" | "type" | "from" | "to" | "wage">) => {
    args = {hints: {wage: true, ...args.hints}, ...args};

    for (const name of ["work", "city", "type", "wage"]) {
      builder.askText(name, f => {
        f.withFormName(args.formAlias, args.form[name]);
        if (args.hints && args.hints[name]) {
          f.showHint();
        }

        if (args.defaults && args.defaults[name]) {
          f.defaultTo(args.defaults[name]);
        }

        if ("hideIf" in args) {
          f.hideIf(args.hideIf);
        }

        if ("showIf" in args) {
          f.showIf(args.showIf);
        }

        return f;
      });
    }
    builder.askForDate("from");
    builder.askForDate("to");

    return builder;
  }
);

type FormAliases = keyof typeof PDF_FORMS | "fb1" | "fb3f" | "fb3m" | "fb1a1";

export const questions = [
  buildQuestionary<FormAliases>("part1")
    .addDocument("certificate_of_matriculation", ctx => ctx.is("intro.phase", Phase.Uni))
    .useForm("Formblatt1", fb => fb
      .setAlias("fb1")
      .addCalculatedMapping("E-Mail_w_Eingabe", ctx => ctx.get("about_me.firstname") + "@" + ctx.get("about_me.name") + ".de")
      .addCalculatedMapping("Name_Vorname_Auszubildender_Eingabe",
        ctx => `${ctx.get("about_me.name")}, ${ctx.get("about_me.firstname")}`)
      .addCalculatedMapping("BWZ_Datum_bis_Eingabe",
        ctx => {
          const start = ctx.get<Date>("intro.start_date");
          const duration = ctx.get<number>("intro.time");

          const month = (start.getMonth() + duration % 12 + 1).toString().padStart(2, "0");
          const year = (start.getMonth() + duration) > 11 ? start.getFullYear() + 1 : start.getFullYear();

          return month + year;
        })
      .addCalculatedMapping("IBAN_Eingabe_1",
        ctx => ctx.get<string>("general.iban").replace(" ", "").substr(0, 4))
      .addCalculatedMapping("IBAN_Eingabe_2",
        ctx => ctx.get<string>("general.iban").replace(" ", "").substr(4, 4))
      .addCalculatedMapping("IBAN_Eingabe_3",
        ctx => ctx.get<string>("general.iban").replace(" ", "").substr(8, 4))
      .addCalculatedMapping("IBAN_Eingabe_4",
        ctx => ctx.get<string>("general.iban").replace(" ", "").substr(12, 4))
      .addCalculatedMapping("IBAN_Eingabe_5",
        ctx => ctx.get<string>("general.iban").replace(" ", "").substr(16, 4))
      .addCalculatedMapping("IBAN_Eingabe_6",
        ctx => ctx.get<string>("general.iban").replace(" ", "").substr(20, 2))
    )
    .useForm("Formblatt3_Father", fb => fb.setAlias("fb3f"))
    .useForm("Formblatt3_Mother", fb => fb.setAlias("fb3m"))
    .useForm("Formblatt1Anlage1", fb => fb.setAlias("fb1a1"))

    .addQuestionContainer("cv", qc => {
      qc
        .printInfo("info", ctx => ctx
          .showHint())
        .askForList("cvEntries", f => f
          .hideText()
          .entries(e => e
            .block("cvEntry", cvEntry, {
              form: {
                city: "__MISSING__",
                from: "__MISSING__", // TODO add pdf mapping
                to: "__MISSING__",
                type: "__MISSING__",
                wage: "__MISSING__",
                work: "__MISSING__"
              },
              formAlias: "fb1a1"
            })
          ));
    })
    .addQuestionContainer("intro", qc => {
        qc
          .askMultipleChoiceQuestion("phase", c => c
            .displayAs(DisplayType.Promoted)
            .option("school", Phase.School, {icon: "school"})
            .option("uni", Phase.Uni, {icon: "graduation"})
            .option("practical", Phase.Practical, {icon: "apprenticeship"}))
          .askForDate("start_date", c => c
            .withFormName("fb1", "BWZ_Datum_vom_Eingabe",
              (date: Date) => (date?.getMonth() + 1).toString().padStart(2, "0") + date.getFullYear())
            .showAsPopup()
            .showHint())
          .askMultipleChoiceQuestion("time", c => c
            .option("1", 1)
            .option("2", 2)
            .option("3", 3)
            .option("4", 4)
            .option("5", 5)
            .option("6", 6)
            .option("7", 7)
            .option("8", 8)
            .option("9", 9)
            .option("10", 10)
            .option("11", 11)
            .option("12", 12)
            .defaultTo(12)
            .showHint()
          )
          .askYesNoQuestion("abroad")
          .askYesNoQuestion("parents", c => c
            .showHint())
          .askYesNoQuestion("firsttime", c => c
            .withFormName("fb1", "früherer_Antrag_Auswahl", (v: boolean) => (+v).toString())
            .showHint())
          .askText("institute", c => c
            .hideIf(ctx => ctx.is("firsttime", null, false))
            .showHint()
            .withFormName("fb1", "Amt_Ausbildungsförderung_Eingabe"))
          .askText("number", c => c
            .validate.exactLength(15)
            .hideIf(ctx => ctx.is("firsttime", null, false))
            .withFormName("fb1", "bisherige_Förderungsnummer_Eingabe"));
      }
    )

    .addQuestionContainer("uni", c => {
      c
        .hideIf(ctx => ctx.is("intro.phase", 1, 3))
        .printInfo("info")
        .askAutocompleteQuestion("university", f => f
          .withFormName("fb1", "Ausbildungsstätte_Eingabe")
          .option(...universities.map(u => ({title: u, value: u}))))
        .askText("subject", f => f.withFormName("fb1", "Klasse_Fachrichtung_Eingabe"))
        .askMultipleChoiceQuestion("graduation", f => f
          .withFormName("fb1", "angestrebter_Anschluss_Eingabe")
          .option("ba", "Bachelor of Arts")
          .option("bsc", "Bachelor of Science")
          .option("llb", "Bachelor of Laws")
          .option("bed", "Bachelor of Education")
          .option("beng", "Bachelor of Engineering")
          .option("bfa", "Bachelor of Fine Arts")
          .option("bmus", "Bachelor of Music")
          .option("bma", "Bachelor of Musical Arts")
          .option("ma", "Master of Arts")
          .option("msc", "Master of Science")
          .option("llm", "Master of Laws")
          .option("med", "Master of Education")
          .option("meng", "Master of Engineering")
          .option("mfa", "Master of Fine Arts")
          .option("mmus", "Master of Music")
        )
        .askText("semester")
        .askMultipleChoiceQuestion("time", f => f
          .option("full", 0)
          .option("part", 1)
          .withFormName("fb1", "Vollzeit_Teilzeit_Auswahl")
          .showHint());
    })

    .addQuestionContainer("abroad", c => {
        c
          .hideIf(ctx => ctx.is("intro.abroad", false))
          .printInfo("info")
          .askText("name", f => f.showHint())
          .askText("address")
          .askText("zip", f => f.hideText())
          .askText("city", f => f.hideText())
          .askText("country", f => f.hideText())
          .askText("type", f => f.showHint())
          .askText("discipline")
          .askYesNoQuestion("prev_discipline")
          // if no we have to put 0 in the pdf form
          .askText("prev_discipline_time", f => f
            .showHint()
            .hideIf(ctx => ctx.is("prev_discipline", false, null)))
          .askYesNoQuestion("prev_discipline_abroad", f => f
            .hideIf(ctx => ctx.is("prev_discipline", false, null)))
          .askText("prev_discipline_abroad_time", f => f
            .showHint()
            .hideIf(ctx => ctx.is("prev_discipline_time", false, null)))
          .askText("prev_discipline_abroad_country", f => f
            .showHint()
            .hideIf(ctx => ctx.is("prev_discipline", false, null) || ctx.is("prev_discipline_abroad", false, null)))
          .askYesNoQuestion("prev_discipline_abroad_bafoeg", f => f
            .hideIf(ctx => ctx.is("prev_discipline_abroad", false, null) || ctx.is("prev_discipline", false, null)))
          .askForDate("prev_discipline_abroad_bafoeg_from", f => f
            .hideIf(ctx => ctx.is("prev_discipline_abroad_bafoeg", false, null) ||
              ctx.is("prev_discipline_abroad", false, null) ||
              ctx.is("prev_discipline", false, null)))
          .askForDate("prev_discipline_abroad_bafoeg_to", f => f
            .hideIf(ctx => ctx.is("prev_discipline_abroad_bafoeg", false, null) ||
              ctx.is("prev_discipline_abroad", false, null) ||
              ctx.is("prev_discipline", false, null)));
      }
    )

    .addQuestionContainer("abroad_study", c => {
      c
        .printInfo("info")
        .hideIf(ctx => ctx.is("intro.abroad", false))
        .askForDate("start", f => f.showAsPopup())
        .askForDate("end", f => f.showAsPopup())
        .askForDate("start_lec", f => f.showAsPopup())
        .askForDate("end_lec", f => f.showAsPopup())
        .askYesNoQuestion("constraint")
        .askText("inland_name", f => f
          .showHint()
          .hideIf(ctx => ctx.is("constraint", false, null))
          .defaultTo(ctx => ctx.get("uni.university")))
        .askText("inland_address", f => f
          .hideIf(ctx => ctx.is("constraint", false, null)))
        .askText("inland_zip", f => f
          .hideText()
          .hideIf(ctx => ctx.is("constraint", false, null)))
        .askText("inland_city", f => f
          .hideText()
          .hideIf(ctx => ctx.is("constraint", false, null)))
        .askText("inland_discipline", f => f
          .hideIf(ctx => ctx.is("constraint", false, null))
          .defaultTo(ctx => ctx.get("abroad.discipline")))
        .askText("final")
        .askText("local")
        .askYesNoQuestion("where")
        .askYesNoQuestion("pay")
        .askText("amount", f => f.hideIf(ctx => ctx.is("pay", null, false)))
        .askText("currency", f => f.hideIf(ctx => ctx.is("pay", null, false)));
    })

    .addQuestionContainer("internship", c => {
        c
          .askText("intern_name", f => f.showHint())
          .askText("intern_address")
          .askText("intern_zip", f => f.hideText())
          .askText("intern_city", f => f.hideText())
          .askText("intern_country", f => f.hideText())
          .askForDate("intern_start", f => f.showAsPopup())
          .askForDate("intern_end", f => f.showAsPopup())
          .askText("discipline")
          .askText("school_name")
          .askText("school_address")
          .askText("school_zip", f => f.hideText())
          .askText("school_city", f => f.hideText())
          .askText("school_country", f => f.hideText())
          .askYesNoQuestion("prev_discipline")
          // if no we have to put 0 in the pdf form
          .askText("prev_discipline_time", f => f
            .showHint()
            .hideIf(ctx => ctx.is("prev_discipline", false, null)))
          .askYesNoQuestion("prev_discipline_abroad", f => f
            .hideIf(ctx => ctx.is("prev_discipline", false, null)))
          .askText("prev_discipline_abroad_time", f => f
            .showHint()
            .hideIf(ctx => ctx.is("prev_discipline_time", false, null)))
          .askText("prev_discipline_abroad_country", f => f
            .showHint()
            .hideIf(ctx => ctx.is("prev_discipline", false, null) || ctx.is("prev_discipline_abroad", false, null)))
          .askYesNoQuestion("prev_discipline_abroad_bafoeg", f => f
            .hideIf(ctx => ctx.is("prev_discipline_abroad", false, null) || ctx.is("prev_discipline", false, null)))
          .askForDate("prev_discipline_abroad_bafoeg_from", f => f
            .hideIf(ctx => ctx.is("prev_discipline_abroad_bafoeg", false, null) ||
              ctx.is("prev_discipline_abroad", false, null) ||
              ctx.is("prev_discipline", false, null)))
          .askForDate("prev_discipline_abroad_bafoeg_to", f => f
            .hideIf(ctx => ctx.is("prev_discipline_abroad_bafoeg", false, null) ||
              ctx.is("prev_discipline_abroad", false, null) ||
              ctx.is("prev_discipline", false, null)));
      }
    )

    .addQuestionContainer("abroad_aids", c => {
        c
          .askYesNoQuestion("aids", f => f
            .showHint())
          .askText("amount", f => f
            .hideIf(ctx => ctx.is("aids", false, null)))
          .askText("currency", f => f
            .hideIf(ctx => ctx.is("aids", false, null)))
          .askText("aid_giver", f => f
            .hideIf(ctx => ctx.is("aids", false, null)));
      }
    )

    .addQuestionContainer("about_me", qc => {
        qc
          .askText("firstname", f => f
            .withFormName("fb1", "Vorname_Eingabe[0]")
            .withFormName("fb3m", "Vorname_Azubi_Eingabe")
            .withFormName("fb3f", "Vorname_Azubi_Eingabe"))
          .askText("name", f => f
            .withFormName("fb1", "Name_Eingabe")
            .withFormName("fb3m", "Name_Azubi_Eingabe[0]")
            .withFormName("fb3f", "Name_Azubi_Eingabe[0]"))
          .askYesNoQuestion("q_birthname")
          .askText("birthname", f => f
            .hideIf(ctx => ctx.is("q_birthname", false, null))
            .withFormName("fb1", "Geburtsname_Eingabe"))
          .askMultipleChoiceQuestion("sex", f => f
            .withFormName("fb1", "Geschlecht_Auswahl", (g: Gender) => g === Gender.Male ? "0" : "1")
            .option("male", Gender.Male)
            .option("female", Gender.Female)
            .showHint())
          .askForDate("birthdate", f => f
            .withFormName("fb1", "Geburtsdatum_Eingabe", formatDateFull)
            .showAsPopup())
          .askText("birthplace", f => f
            .showHint()
            .withFormName("fb1", "Geburtsort_Eingabe"))
          .askMultipleChoiceQuestion("foreveralone", c => c
            .withFormName("fb1", "Familienstand_Auswahl")
            .option("alone", 0)
            .option("married", 1)
            .option("seperated", 2)
            .option("weathered", 3)
            .option("divorced", 4))
          .askForDate("status_since", f => f
            .withFormName("fb1", "Formular1[0].Formblatt1_Seite1[0].Datum_Eingabe[0]", formatDateFull)
            .hideIf(ctx => ctx.is("foreveralone", 0, null))
            .showAsPopup())
          .askYesNoQuestion("german_nationality", f => f
            .withFormName("fb1", "Staatsangehörigkeit_Auswahl", (val: boolean) => (+!val).toString()))
          .askText("nationality", f => f // TODO use dropdown instead
            .withFormName("fb1", "Staatsangehörigkeit_andere_Eingabe")
            .hideIf(ctx => ctx.is("german_nationality", true, null))
            .showHint())
          .askText("nationality_partner", f => f
            .withFormName("fb1", "Staatsangehörigkeit_Ehegatte_Eingabe")
            .showIf(ctx => ctx.is("foreveralone", 1, 2))
            .defaultTo(ctx => ctx.is("german_nationality", true) ? "DE" : ctx.get("nationality"))
            .showHint())
          .askYesNoQuestion("children", f => f
            .showHint());
      }
    )

    .addQuestionContainer("mine_address", c => {
        c
          .printInfo("main_address")
          .block("main_address", askForAddress, {
            form: {
              address: "Straße_Hausnummer_Eingabe",
              zip: "PLZ_Eingabe",
              country: "Kennbuchstaben_Eingabe",
              city: "Ort_Eingabe",
              state: "Bundesland_Eingabe"
            },
            formAlias: "fb1"
          })
          .askYesNoQuestion("q_bell")
          .askText("bell", f => f
            .withFormName("fb1", "bei_Eingabe")
            .hideIf(ctx => ctx.is("q_bell", true, null))
            .showHint())
          .askYesNoQuestion("q_different_address_while_studying", f => f
            .withFormName("fb1", "Wohnung_bei_Eltern_Auswahl", formatBoolNeg))
          .askText("reason_for_own_household", f => f
            .withFormName("fb1", "Gründe_eigener_Wohnsitz_Eingabe")
            .hideIf(ctx => !(ctx.is("q_different_address_while_studying", false) && ctx.is_n("phase", "intro", Phase.School))))
          .askYesNoQuestion("know_address", f => f
            .showIf(ctx => ctx.is("q_different_address_while_studying", true)))
          .printInfo("sec_address", f => f
            .showIf(ctx => ctx.is("know_address", true) && ctx.is("q_different_address_while_studying", 0, 2)))

          .block("sec_address",
            askForAddress,
            {
              form: {
                address: "Straße_Hausnummer_w_Eingabe",
                city: "Ort_w_Eingabe",
                country: "Kennbuchstaben_w_Eingabe",
                zip: "PLZ_w_Eingabe",
                state: "Bundesland_w_Eingabe"
              },
              showIf: (ctx => ctx.is("know_address", true) && ctx.is("q_different_address_while_studying", true)),
              formAlias: "fb1"
            })

          .askText("sec_bell", f => f
            .withFormName("fb1", "bei_w_Eingabe")
            .showIf(ctx => ctx.is("know_address", true) && ctx.is("q_different_address_while_studying", true))
            .showHint()
            .withFormName("fb1", "bei_w_Eingabe"))
          .askYesNoQuestion("prop_of_parents", f => f
            .withFormName("fb1", "Eigentum_Eltern_Auswahl", formatBoolNeg)
            .hideIf(ctx => ctx.is("know_address", false, null) || ctx.is("q_different_address_while_studying", false, null)));
      }
    )

    .addQuestionContainer("capital", qc => {
        qc
          .askYesNoQuestion("bar")
          .askText("bar_amount", c => c
            .hideIf(ctx => ctx.is("bar", false, null))
            .defaultTo(0)
            .withFormName("fb1", "Barvermögen_Eingabe"))
          .askYesNoQuestion("bank")
          .askText("bank_amount", c => c
            .hideIf(ctx => ctx.is("bank", false, null))
            .defaultTo(0)
            .withFormName("fb1", "Bankguthaben_Eingabe"))
          .askYesNoQuestion("building_savings")
          .askText("building_savings_amount", c => c
            .hideIf(ctx => ctx.is("building_savings", false, null))
            .defaultTo(0)
            .withFormName("fb1", "Bausparguthaben_Eingabe"))
          .askYesNoQuestion("retirement")
          .askText("retirement_amount", c => c
            .hideIf(ctx => ctx.is("retirement", false, null))
            .defaultTo(0)
            .withFormName("fb1", "Altersvorsorge_Eingabe"))
          .askYesNoQuestion("kfz")
          .askText("kfz_amount", c => c
            .hideIf(ctx => ctx.is("kfz", false, null))
            .withFormName("fb1", "KFZ_Eingabe")
            .defaultTo(0)
            .showHint())
          .askYesNoQuestion("stocks")
          .askText("buisness_assets", c => c
            .withFormName("fb1", "Vermögen_sonstig_Eingabe")
            .hideIf(ctx => ctx.is("stocks", false, null))
            .defaultTo(0)
            .showHint())
          .askText("stock", c => c
            .withFormName("fb1", "Wertpapiere_Eingabe")
            .hideIf(ctx => ctx.is("stocks", false, null))
            .defaultTo(0)
            .showHint())
          .askText("life", c => c
            .withFormName("fb1", "LV_Eingabe")
            .hideIf(ctx => ctx.is("stocks", false, null))
            .defaultTo(0)
            .showHint())
          .askYesNoQuestion("land")
          .askText("forest", c => c
            .hideIf(ctx => ctx.is("land", false, null))
            .withFormName("fb1", "Land_Eingabe")
            .defaultTo(0)
            .showHint())
          .askText("vacant", c => c
            .hideIf(ctx => ctx.is("land", false, null))
            .withFormName("fb1", "Grundstücke_Eingabe")
            .defaultTo(0)
            .showHint())
          .askText("built", c => c
            .hideIf(ctx => ctx.is("land", false, null))
            .withFormName("fb1", "Grundstücke_bebaut_Eingabe")
            .defaultTo(0)
            .showHint())
          .askYesNoQuestion("other")
          .askText("pension", c => c
            .hideIf(ctx => ctx.is("other", false, null))
            .withFormName("fb1", "Betriebsvermögen_Eingabe")
            .defaultTo(0)
            .showHint())
          .askText("other_amount", c => c
            .hideIf(ctx => ctx.is("other", false, null))
            .defaultTo(0)
            .withFormName("fb1", "Forderungen_Eingabe"));
      }
    )
    .addQuestionContainer("income", c => {
        c
          .printInfo("you_will")
          .askYesNoQuestion("income", f => f
            .withFormName("fb1", "Einnahmen_Auswahl", formatBool))
          .askYesNoQuestion("intership", f => f
            .hideIf(ctx => ctx.is("income", false, null)))
          .askText("intership_amount", f => f
            .withFormName("fb1", "Ausbildungsvergütung_Eingabe")
            .hideIf(ctx => ctx.is("intership", false, null))
            .showHint())
          .askYesNoQuestion("holiday", f => f
            .hideIf(ctx => ctx.is("income", false, null)))
          .askText("holiday_amount", f => f
            .withFormName("fb1", "Arbeitsverhältnis_Eingabe")
            .hideIf(ctx => ctx.is("holiday", false, null))
            .showHint())
          .askYesNoQuestion("service", f => f
            .hideIf(ctx => ctx.is("holiday", false, null))
            .hideIf(ctx => ctx.is("holiday", false, null) && ctx.is("intership", false, null))
            .showHint())
          .askYesNoQuestion("independence", f => f
            .hideIf(ctx => ctx.is("income", false, null)))
          .askText("independence_amount", f => f
            .withFormName("fb1", "Einkünfte_selbst_Eingabe")
            .hideIf(ctx => ctx.is("independence", false, null)))
          .askYesNoQuestion("capital", f => f
            .hideIf(ctx => ctx.is("income", false, null)))
          .askText("capital_amount", f => f
            .withFormName("fb1", "Kapitalvermögen_Eingabe")
            .hideIf(ctx => ctx.is("capital", false, null))
            .showHint())
          .askYesNoQuestion("sholarship", f => f
            .hideIf(ctx => ctx.is("income", false, null)))
          .askText("sholarship_amount", f => f
            .withFormName("fb1", "Zuwendungen_Eingabe")
            .hideIf(ctx => ctx.is("sholarship", false, null)))
          .askYesNoQuestion("bafog_regulation", f => f
            .hideIf(ctx => ctx.is("income", false, null)))
          .askText("bafog_regulation_amount", f => f
            .withFormName("fb1", "Einkommensverordnung_Eingabe")
            .hideIf(ctx => ctx.is("bafog_regulation", false, null))
            .showHint())
          .askYesNoQuestion("children_entertains", f => f
            .hideIf(ctx => ctx.is("income", false, null) || ctx.is("about_me.children", false, null)))
          .askText("children_entertains_amount", f => f
            .withFormName("fb1", "Unterhaltbedarf_Kinder_Eingabe")
            .hideIf(ctx => ctx.is("children_entertains", false, null))
            .showHint())
          .askYesNoQuestion("partner_entertains", f => f
            .hideIf(ctx => ctx.is("income", false, null) || ctx.is_n("about_me", "foreveralone", 1, 3, 4, 5)))
          .askText("partner_entertains_amount", f => f
            .withFormName("fb1", "Unterhaltbedarf_Ehegatte_Eingabe")
            .hideIf(ctx => ctx.is("partner_entertains", false, null))
            .showHint())
          .askYesNoQuestion("ex_partner_entertains", f => f
            .hideIf(ctx => ctx.is("income", false, null)))
          .askText("ex_partner_entertains_amount", f => f
            .withFormName("fb1", "Unterhalt_Eingabe")
            .hideIf(ctx => ctx.is("ex_partner_entertains", false, null))
            .showHint())
          .askYesNoQuestion("support", f => f.hideIf(ctx => ctx.is("income", false, null)))
          .askText("support_amount", f => f
            .withFormName("fb1", "Beihilfen_Eingabe")
            .hideIf(ctx => ctx.is("support", false, null))
            .showHint())
          .askText("other", f => f
            .withFormName("fb1", "Beihilfen_sonstige_Eingabe")
            .hideIf(ctx => ctx.is("support", false, null)))
          .askYesNoQuestion("rister")
          .askText("rister_amount", f => f
            .withFormName("fb1", "geförderte_Altersvorsorge_Eingabe")
            .hideIf(ctx => ctx.is("rister", false, null))
            .showHint())
          .askYesNoQuestion("pension", f => f.hideIf(ctx => ctx.is("income", false, null)))
          .askText("pension_amount", f => f
            .withFormName("fb1", "Waisen_Eingabe")
            .hideIf(ctx => ctx.is("pension", false, null))
            .showHint())
          .askText("other_pension", f => f
            .withFormName("fb1", "Sonstiger_Renten_Eingabe")
            .hideIf(ctx => ctx.is("pension", false, null)))
          .askYesNoQuestion("social")
          .askText("social_info", f => f
            .withFormName("fb1", "Sozialleist_nichtbew_Eingabe")
            .hideIf(ctx => ctx.is("social", false, null))
            .showHint());
      }
    )

    .addQuestionContainer("debts", c => {
      c
        .askYesNoQuestion("mortgage")
        .askText("mortgage_amount", f => f
          .withFormName("fb1", "Hypotheken_Eingabe")
          .defaultTo(0)
          .hideIf(ctx => ctx.is("mortgage", false, null)))
        .askYesNoQuestion("repeat")
        .askText("repeat_amount", f => f
          .withFormName("fb1", "Lasten_Eingabe")
          .defaultTo(0)
          .hideIf(ctx => ctx.is("repeat", false, null)))
        .askYesNoQuestion("other")
        .askText("other_amount", f => f
          .withFormName("fb1", "Schulden_Eingabe")
          .defaultTo(0)
          .hideIf(ctx => ctx.is("other", false, null))
          .showHint());
    })

    .addQuestionContainer("mother", c => {
      c
        .askText("firstname", f => f
          .withFormName("fb1", "Mutter_Vorname_Eingabe")
          .withFormName("fb3m", "Vorname_Eingabe"))
        .askText("name", f => f
          .withFormName("fb1", "Mutter_Name_Eingabe")
          .withFormName("fb3m", "Name_Eingabe"))
        .askYesNoQuestion("birthname_q")
        .askText("birthname", f => f
          .showIf(ctx => ctx.is("birthname_q", true)))
        .askForDate("birthdate", f => f
          .withFormName("fb1", "Mutter_Geburtsdatum_Eingabe", formatDateFull)
          .withFormName("fb3m", "Geburtsdatum_Eingabe", formatDateFull)
          .showAsPopup())
        .askYesNoQuestion("alive")
        .askForDate("death_date", f => f
          .withFormName("fb1", "Mutter_Sterbedatum_Eingabe[1]", formatDateFull)
          .showAsPopup()
          .showIf(ctx => ctx.is("alive", true)));
    })

    .addQuestionContainer("mother_other", c => {
      c
        .hideIf(ctx => ctx.is("mother.alive", true, null))
        .askText("street", f => f
          .withFormName("fb1", "Mutter_Adresse_Eingabe")
          .withFormName("fb3m", "Straße_Eingabe")
        )
        .askText("city")
        .askText("zip")
        .askYesNoQuestion("telefon_q")
        .askText("telefon", f => f
          .hideIf(ctx => ctx.is("telefon_q", false, null)))
        .askYesNoQuestion("mail_q")
        .askText("mail", f => f
          .withFormName("fb1", "E-Mail_w_Eingabe")
          .hideIf(ctx => ctx.is("mail_q", false, null)))
        .askYesNoQuestion("german_nationality")
        .askText("nationality", f => f // TODO use dropdown instead
          .hideIf(ctx => ctx.is("german_nationality", true, null))
          .showHint())
        .askMultipleChoiceQuestion("foreveralone", f => f
          .option("alone", 1)

          .option("married", 2)
          .option("seperated", 3)
          .option("weathered", 4)
          .option("divorced", 5))
        .askForDate("since", f => f
          .hideIf(ctx => ctx.is("foreveralone", 1)))
        .askYesNoQuestion("income");
    })

    .addQuestionContainer("mother_income", c => {
      c
        .hideIf(ctx => ctx.is("mother_other.income", false, null))
        .askMultipleChoiceQuestion("employment_relationship", f => f
          .option("worker", 1)
          .option("employee", 2)
          .option("official", 3)
          .option("entrepreneur", 4)
          .option("notlonger", 5))
        .askForDate("since", f => f
          .showAsPopup()
          .hideIf(ctx => !ctx.is("employment_relationship", 6)))
        .askMultipleChoiceQuestion("employment_relationship_past", f => f
          .option("worker", 1)
          .option("employee", 2)
          .option("official", 3)
          .option("entrepreneur", 4))
        .printInfo("tax_info")
        .askYesNoQuestion("tax_1")
        .askYesNoQuestion("tax_2")
        .askYesNoQuestion("tax_3", f => f
          .showHint())
        .askMultipleChoiceQuestion("tax_3_ext", f => f
          .hideIf(ctx => ctx.is("tax_3", true))
          .option("father", 1)
          .option("other", 2))
        .askText("office", f => f
          .hideIf(ctx => ctx.is("tax_3", true)))
        .askText("number", f => f
          .hideIf(ctx => ctx.is("tax_3", true)));
    })

    .addQuestionContainer("father", c => c)

    .addQuestionContainer("children", c => c
      .hideIf(ctx => ctx.is("about_me.children", false, null))
      .askForList("children", l => l
        .showElementCaption()
        .entries(b => b
          .askText("firstName", fb => fb
            .withListFormName("fb1", "Kind1_Name_Eingabe", 0)
            .withListFormName("fb1", "Kind2_Name_Eingabe", 1)
          )
          .askText("lastName")
          .askForDate("birthDate")
        ))
    )

    .addQuestionContainer("partner", c => {
      c
        .hideIf(ctx => !ctx.is("about_me.foreveralone", 2));
    })

    .addQuestionContainer("general", c => {
        c
          .printInfo("money_info")
          .askYesNoQuestion("your_acc", f => f
            .defaultTo(true))
          .askText("whose_acc", f => f
            .withFormName("fb1", "Name_Kontoinhaber_Eingabe")
            .showIf(ctx => ctx.is("your_acc", false)))
          .askText("money_inst", f => f.withFormName("fb1", "Name_Sitz_Geldinstitut_Eingabe"))
          .askText("iban", f => f
            .validate.custom("iban", value => ({
              valid: isValidIBANNumber(value)
            })))
          .askText("bic", f => f.withFormName("fb1", "BIC_Eingabe"))
          .askText("tax_ident", f => f
            .withFormName("fb1", "Steueridentifikationsnummer_Eingabe")
            .showHint())
          // TODO: IMPLEMENT LOGIC
          .askMultipleChoiceQuestion("post", f => f
            .withFormName("fb1", "Bescheid_Auswahl1")
            .option("me_main", 0)
            .option("me_sec", 1)
            .option("mother", 2)
            .option("father", 3)
            .option("custodian", 4));
      }
    )

    .build()
];
