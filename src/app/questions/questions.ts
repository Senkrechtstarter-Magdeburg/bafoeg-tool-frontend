import { buildQuestionary, defineBlock, QuestionContext } from "@shared/builder";
import { DisplayType, QuestionEntry } from "@models/questions";

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
  hints?: { [k in T]?: boolean };
  defaults?: { [k in T]?: QuestionEntry["defaultValue"] };
  hideIf?: (ctx: QuestionContext) => boolean
} | {
  form: { [k in T]: string };
  hints?: { [k in T]?: boolean };
  defaults?: { [k in T]?: QuestionEntry["defaultValue"] };
  showIf?: (ctx: QuestionContext) => boolean
}

export const askForAddress = defineBlock("address",
  (builder,
    args: BlockArgs<"address" | "zip" | "city" | "country">) => {

    args = { hints: { country: true, ...args.hints }, defaults: { country: () => "DE", ...args.defaults }, ...args };

    for (const name of ["address", "zip", "city", "country"]) {
      builder.askText(name, f => {
        if (name !== "address") {
          f.hideText();
        }

        f.withFormName(args.form[name]);
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
      });
    }

    return builder;
  }
);

export const cvEntry = defineBlock("cvEntry",
  (builder, args: BlockArgs<"work" | "city" | "type" | "from" | "to" | "wage">) => {
    args = { hints: { wage: true, ...args.hints }, ...args };

    for (const name of ["work", "city", "type", "wage"]) {
      builder.askText(name, f => {
        f.withFormName(args.form[name]);
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
    builder.askForDate("from")
    builder.askForDate("to")

    return builder;
  }
);

export const questions = [
  buildQuestionary("part1")
    .useForm("Formblatt1", fb => fb
      .addCalculatedMapping("E-Mail_w_Eingabe", ctx => ctx.get("about_me.firstname") + "@" + ctx.get("about_me.name") + ".de")
      .addCalculatedMapping("Name_Vorname_Auszubildender_Eingabe",
        ctx => `${ctx.get("about_me.name")}, ${ctx.get("about_me.firstname")}`))

    .addQuestionContainer("cv", qc => qc
      .printInfo("info", ctx => ctx
        .showHint())
      .askForList("cvEntries", f => f
        .hideText()
        .entries(e => e
          .block("cvEntry", cvEntry, {
        form: {
          city: "",
          from: "", // TODO add pdf mapping
          to: "",
          type: "",
          wage: "",
          work: ""
        }
      })
          )))
    .addQuestionContainer("intro", qc => qc
      .askMultipleChoiceQuestion("phase", c => c
        .displayAs(DisplayType.Promoted)
        .option("school", Phase.School, { icon: "school" })
        .option("uni", Phase.Uni, { icon: "graduation" })
        .option("practical", Phase.Practical, { icon: "apprenticeship" }))
      .askForDate("start_date", c => c
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
        .showHint())
      .askText("institute", c => c
        .hideIf(ctx => ctx.is("firsttime", null, false))
        .showHint()
        .withFormName("Amt_Ausbildungsförderung_Eingabe"))
      .askText("number", c => c
        .hideIf(ctx => ctx.is("firsttime", null, false))
        .withFormName("bisherige_Förderungsnummer_Eingabe"))
    )

    .addQuestionContainer("uni", c => c
      .hideIf(ctx => ctx.is("intro.phase", 1, 3))
      .printInfo("info")
      .askText("university", f => f.withFormName("Ausbildungsstätte_Eingabe"))
      .askText("subject", f => f.withFormName("Klasse_Fachrichtung_Eingabe"))
      .askMultipleChoiceQuestion("graduation", f => f
        .withFormName("angestrebter_Anschluss_Eingabe")
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
        .withFormName("Vollzeit_Teilzeit_Auswahl")
        .showHint()))

    .addQuestionContainer("abroad", c => c
      .hideIf(ctx => ctx.is("intro.abroad", false))
      .printInfo("info")
      .askText("name")
      .askText("address")
      .askText("zip", f => f.hideText())
      .askText("city", f => f.hideText())
      .askText("country", f => f.hideText())
      .askText("type", f => f.showHint())
      .askText("discipline")
      .askYesNoQuestion("prev_discipline")
      //if no we have to put 0 in the pdf form
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
        //.hideIf(ctx => ctx.is("prev_discipline", false, null)))
      .askForDate("prev_discipline_abroad_bafoeg_from", f => f
        .hideIf(ctx => ctx.is("prev_discipline_abroad_bafoeg", false, null) || ctx.is("prev_discipline_abroad", false, null)))
        //.hideIf(ctx => ctx.is("prev_discipline_abroad", false, null)))
      .askForDate("prev_discipline_abroad_bafoeg_to", f => f
        .hideIf(ctx => ctx.is("prev_discipline_abroad_bafoeg", false, null) || ctx.is("prev_discipline_abroad", false, null)))
        //.hideIf(ctx => ctx.is("prev_discipline_abroad", false, null)))
      ) 

    .addQuestionContainer("abroad_study", c => c
      .printInfo("info")
      .hideIf(ctx => ctx.is("intro.abroad", false))
      .askForDate("start", f => f.showAsPopup())
      .askForDate("end", f => f.showAsPopup())
      .askForDate("start_lec", f => f.showAsPopup())
      .askForDate("end_lec", f => f.showAsPopup()))

    .addQuestionContainer("about_me", qc => qc
      .askText("firstname", f => f.withFormName("Vorname_Eingabe"))
      .askText("name", f => f
        .withFormName("Name_Eingabe"))
      .askYesNoQuestion("q_birthname")
      .askText("birthname", f => f
        .hideIf(ctx => ctx.is("q_birthname", false, null))
        .withFormName("Geburtsname_Eingabe"))
      .askMultipleChoiceQuestion("sex", f => f
        .withFormName("Geschlecht_Auswahl", (g: Gender) => g === Gender.Male ? "0" : "1")
        .option("male", Gender.Male)
        .option("female", Gender.Female)
        .showHint())
      .askForDate("birthdate", f => f
        .withFormName("Geburtsdatum_Eingabe", (d: string) => {
          const date = new Date(d);
          const day = date.getDate().toString().padStart(2, "0");
          const month = (date.getMonth() + 1).toString().padStart(2, "0");
          const year = date.getFullYear().toString().padStart(2, "0");
          return `${day}${month}${year}`;
        })
        .showAsPopup())
      .askText("birthplace", f => f
        .showHint()
        .withFormName("Geburtsort_Eingabe"))
      .askMultipleChoiceQuestion("foreveralone", c => c
        .option("alone", 1)
        .option("married", 2)
        .option("seperated", 3)
        .option("weathered", 4)
        .option("divorced", 5))
      .askForDate("status_since", f => f
        .hideIf(ctx => ctx.is("foreveralone", 1, null))
        .showAsPopup())
      .askYesNoQuestion("german_nationality")
      .askText("nationality", f => f // TODO use dropdown instead
        .hideIf(ctx => ctx.is("german_nationality", true, null))
        .showHint())
      .askYesNoQuestion("children", f => f
        .showHint())
    )

    .addQuestionContainer("mine_address", c => c
      .printInfo("main_address")
      .block("main_address", askForAddress, {
        form: {
          address: "Straße_Hausnummer_Eingabe",
          zip: "PLZ_Eingabe",
          country: "Kennbuchstaben_Eingabe",
          city: "Ort_Eingabe",
        }
      })
      .askYesNoQuestion("q_bell")
      .askText("bell", f => f
        .hideIf(ctx => ctx.is("q_bell", true, null))
        .showHint())
      .askYesNoQuestion("q_different_address_while_studying")
      .askText("reason_for_own_household", f => f
        .hideIf(ctx => !(ctx.is("q_different_address_while_studying", false) && ctx.is_n("phase", "intro", Phase.School))))
      .askYesNoQuestion("know_address", f => f
        .showIf(ctx => ctx.is("q_different_address_while_studying", true)))
      .printInfo("sec_address", f => f
        .showIf(ctx => ctx.is("know_address", true) && ctx.is("q_different_address_while_studying", 0, 2)))

      .block("sec_address",
        askForAddress,
        {
          form: { address: "", city: "", country: "", zip: "" },
          showIf: (ctx => ctx.is("know_address", true) && ctx.is("q_different_address_while_studying", true))
        })

      .askText("sec_bell", f => f
        .hideIf(ctx => ctx.is("know_address", false, null) || ctx.is("q_different_address_while_studying", true, null))
        .showHint()
        .withFormName("bei_w_Eingabe"))
      .askYesNoQuestion("prop_of_parents", f => f
        .hideIf(ctx => ctx.is("know_address", false, null) || ctx.is("q_different_address_while_studying", true, null)))
    )

    .addQuestionContainer("capital", qc => qc
      .printInfo("capital")
      .askYesNoQuestion("bar")
      .askText("bar_amount", c => c
        .hideIf(ctx => ctx.is("bar", false, null))
        .withFormName("Barvermögen_Eingabe"))
      .askYesNoQuestion("bank")
      .askText("bank_amount", c => c
        .hideIf(ctx => ctx.is("bank", false, null))
        .withFormName("Bankguthaben_Eingabe"))
      .askYesNoQuestion("building_savings")
      .askText("building_savings_amount", c => c
        .hideIf(ctx => ctx.is("building_savings", false, null))
        .withFormName("Bausparguthaben_Eingabe"))
      .askYesNoQuestion("retirement")
      .askText("retirement_amount", c => c
        .hideIf(ctx => ctx.is("retirement", false, null))
        .withFormName("Altersvorsorge_Eingabe"))
      .askYesNoQuestion("kfz")
      .askText("kfz_amount", c => c
        .hideIf(ctx => ctx.is("kfz", false, null))
        .withFormName("KFZ_Eingabe")
        .showHint())
      .askYesNoQuestion("stocks")
      .askText("buisness_assets", c => c
        .withFormName("Vermögen_sonstig_Eingabe")
        .hideIf(ctx => ctx.is("stocks", false, null))
        .showHint())
      .askText("stock", c => c
        .withFormName("Wertpapiere_Eingabe")
        .hideIf(ctx => ctx.is("stocks", false, null))
        .showHint())
      .askText("life", c => c
        .withFormName("LV_Eingabe")
        .hideIf(ctx => ctx.is("stocks", false, null))
        .showHint())
      .askYesNoQuestion("land")
      .askText("forest", c => c
        .hideIf(ctx => ctx.is("land", false, null))
        .withFormName("Land_Eingabe")
        .showHint())
      .askText("vacant", c => c
        .hideIf(ctx => ctx.is("land", false, null))
        .withFormName("Grundstücke_Eingabe")
        .showHint())
      .askText("built", c => c
        .hideIf(ctx => ctx.is("land", false, null))
        .withFormName("Grundstücke_bebaut_Eingabe")
        .showHint())
      .askYesNoQuestion("other")
      .askText("pension", c => c
        .hideIf(ctx => ctx.is("other", false, null))
        .withFormName("Betriebsvermögen_Eingabe")
        .showHint())
      .askText("other_amount", c => c
        .hideIf(ctx => ctx.is("other", false, null))
        .withFormName("Forderungen_Eingabe"))
    )
    .addQuestionContainer("income", c => c
      .printInfo("you_will")
      .askYesNoQuestion("income")
      .askYesNoQuestion("intership", f => f
        .hideIf(ctx => ctx.is("income", false, null)))
      .askText("intership_amount", f => f
        .withFormName("Ausbildungsvergütung_Eingabe")
        .hideIf(ctx => ctx.is("intership", false, null))
        .showHint())
      .askYesNoQuestion("holiday", f => f
        .hideIf(ctx => ctx.is("income", false, null)))
      .askText("holiday_amount", f => f
        .withFormName("Arbeitsverhältnis_Eingabe")
        .hideIf(ctx => ctx.is("holiday", false, null))
        .showHint())
      .askYesNoQuestion("service", f => f
        .hideIf(ctx => ctx.is("holiday", false, null))
        .hideIf(ctx => ctx.is("holiday", false, null) && ctx.is("intership", false, null))
        .showHint())
      .askYesNoQuestion("independence", f => f
        .hideIf(ctx => ctx.is("income", false, null)))
      .askText("independence_amount", f => f
        .withFormName("Einkünfte_selbst_Eingabe")
        .hideIf(ctx => ctx.is("independence", false, null)))
      .askYesNoQuestion("capital", f => f
        .hideIf(ctx => ctx.is("income", false, null)))
      .askText("capital_amount", f => f
        .withFormName("Kapitalvermögen_Eingabe")
        .hideIf(ctx => ctx.is("capital", false, null))
        .showHint())
      .askYesNoQuestion("sholarship", f => f
        .hideIf(ctx => ctx.is("income", false, null)))
      .askText("sholarship_amount", f => f
        .withFormName("Zuwendungen_Eingabe")
        .hideIf(ctx => ctx.is("sholarship", false, null)))
      .askYesNoQuestion("bafog_regulation", f => f
        .hideIf(ctx => ctx.is("income", false, null)))
      .askText("bafog_regulation_amount", f => f
        .withFormName("Einkommensverordnung_Eingabe")
        .hideIf(ctx => ctx.is("bafog_regulation", false, null))
        .showHint())
      .askYesNoQuestion("children_entertains", f => f
        .hideIf(ctx => ctx.is("about_me.children", false, null)))
      .askText("children_entertains_amount", f => f
        .hideIf(ctx => ctx.is("children_entertains", false, null))
        .showHint())
      .askYesNoQuestion("partner_entertains", f => f
        .hideIf(ctx => ctx.is_n("about_me", "foreveralone", 1, 3, 4, 5)))
      .askText("partner_entertains_amount", f => f
        .hideIf(ctx => ctx.is("partner_entertains", false, null))
        .showHint())
      .askYesNoQuestion("ex_partner_entertains")
      .askText("ex_partner_entertains_amount", f => f
        .hideIf(ctx => ctx.is("ex_partner_entertains", false, null))
        .showHint())
      .askYesNoQuestion("support")
      .askText("support_amount", f => f
        .hideIf(ctx => ctx.is("support", false, null))
        .showHint())
      .askText("other", f => f
        .hideIf(ctx => ctx.is("support", false, null)))
      .askYesNoQuestion("rister")
      .askText("rister_amount", f => f
        .hideIf(ctx => ctx.is("rister", false, null))
        .showHint())
      .askYesNoQuestion("pension")
      .askText("pension_amount", f => f
        .withFormName("Waisen_Eingabe")
        .hideIf(ctx => ctx.is("pension", false, null))
        .showHint())
      .askText("other_pension", f => f
        .hideIf(ctx => ctx.is("pension", false, null)))
      .askYesNoQuestion("social")
      .askText("social_info", f => f
        .hideIf(ctx => ctx.is("social", false, null))
        .showHint())
    )

    .addQuestionContainer("debts", c => c
      .printInfo("debt")
      .askYesNoQuestion("mortgage")
      .askText("mortgage_amount", f => f
        .withFormName("Hypotheken_Eingabe")
        .hideIf(ctx => ctx.is("mortgage", false, null)))
      .askYesNoQuestion("repeat")
      .askText("repeat_amount", f => f
        .withFormName("Lasten_Eingabe")
        .hideIf(ctx => ctx.is("repeat", false, null)))
      .askYesNoQuestion("other")
      .askText("other_amount", f => f
        .withFormName("Schulden_Eingabe")
        .hideIf(ctx => ctx.is("other", false, null))
        .showHint()))

    .addQuestionContainer("mother", c => c
      .askText("forname")
      .askText("name")
      .askYesNoQuestion("birthname_q")
      .askText("birthname", f => f
        .hideIf(ctx => ctx.is("birthname_q", false)))
      .askForDate("birthdate", f => f.showAsPopup())
      .askYesNoQuestion("alive")
      .askForDate("death_date", f => f
        .showAsPopup()
        .hideIf(ctx => ctx.is("alive", false))))

    .addQuestionContainer("mother_other", c => c
      .hideIf(ctx => ctx.is("mother.alive", true))
      .askText("street")
      .askText("city")
      .askText("zip")
      .askYesNoQuestion("telefon_q")
      .askText("telefon", f => f
        .hideIf(ctx => ctx.is("telefon_q", false, null)))
      .askYesNoQuestion("mail_q")
      .askText("mail", f => f
        .withFormName("E-Mail_w_Eingabe")
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
      .askYesNoQuestion("income"))

    .addQuestionContainer("mother_income", c => c
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
        .hideIf(ctx => ctx.is("tax_3", true))))

    .addQuestionContainer("father", c => c)

    .addQuestionContainer("children", c => c
      .hideIf(ctx => ctx.is("about_me.children", false, null))
      .askForList("children", l => l
        .showElementCaption()
        .entries(b => b
          .askText("firstName", fb => fb.withFormName("Vorname_Eingabe"))
          .askText("lastName")
          .askForDate("birthDate")
        ))
    )

    .addQuestionContainer("partner", c => c
      .hideIf(ctx => !ctx.is("about_me.foreveralone", 2)))

    .addQuestionContainer("general", c => c
      .printInfo("money_info")
      .askYesNoQuestion("your_acc", f => f
        .defaultTo(true))
      .askText("whose_acc", f => f
        .hideIf(ctx => ctx.is("your_acc", true)))
      .askText("money_inst")
      .askText("iban")
      .askText("blz")
      .askText("tax_ident", f => f.showHint())
      // TODO: IMPLEMENT LOGIC
      .askMultipleChoiceQuestion("post", f => f
        .option("me_main", 1)
        .option("me_sec", 2)
        .option("mother", 3)
        .option("father", 4)
        .option("custodian", 5))
    )

    .build()
];
