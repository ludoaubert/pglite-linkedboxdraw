
INSERT INTO box(idbox, title) VALUES (1, 'DOS_ETAPE);
INSERT INTO field(name, idbox) VALUES 
	('id', 1),
	('parent_id', 1),
	('dossier_id', 1),
	('etape_code', 1),
	('etape_libelle_long', 1),
	('lancement_date', 1),
	('responsable_id', 1),
	('service_code', 1),
	('execution_date', 1),
	('cre_date', 1),
	('cre_utilisateur', 1),
	('maj_date', 1),
	('maj_utilisateur', 1);

INSERT INTO box(idbox, title) VALUES (2, 'DOS_DATE');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 2),
	('code', 2),
	('date_date', 2),
	('numero_libelle', 2),
	('numero_filtre_libelle', 2),
	('pays_code', 2),
	('date_id', 2),
	('cre_date', 2),
	('maj_date', 2),
	('maj_utilisateur', 2),
	('sys_nc00015', 2),
	('etape_id', 2);

INSERT INTO box(idbox, title) VALUES (3, 'FAC_COMPTABLE_LIGNE');
INSERT INTO field(name, idbox) VALUES
	('comptabilite_id', 3),
	('poste_code', 3),
	('ligne_code', 3),
	('montant', 3),
	('cre_date', 3),
	('cre_utilisateur', 3),
	('id', 3);
	
INSERT INTO box(idbox, title) VALUES (4, 'DOS_TIERS');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 4),
	('code', 4),
	('tiers_id', 4),
	('reference_libelle', 4),
	('reference_filtre_libelle', 4),
	('cre_date', 4),
	('copro_taux', 4),
	('classement_numero', 4);

INSERT INTO box(idbox, title) VALUES (5, 'TIE_CRITERE');
INSERT INTO field(name, idbox) VALUES
	('portefeuille_id', 5),
	('critere_code', 5),
	('valeur_code', 5),
	('cre_date', 5),
	('maj_date', 5);

INSERT INTO box(idbox, title) VALUES (6, 'TIE_PORTEFEUILLE');
INSERT INTO field(name, idbox) VALUES
	('id', 6),
	('tiers_id', 6),
	('cre_date', 6),
	('libelle_long', 6),
	('tri_numero', 6);

INSERT INTO box(idbox, title) VALUES (7, 'FAC_COMPTABLE_LIGNE_DETAIL');
INSERT INTO field(name, idbox) VALUES
	('id', 7),
	('ligne_id', 7),
	('poste_code', 7),
	('ligne_code', 7),
	('montant', 7),
	('cre_date', 7);

INSERT INTO box(idbox, title) VALUES (8, 'FAC_COMPTABLE');
INSERT INTO field(name, idbox) VALUES
	('id', 8),
	('facture_id', 8),
	('type_code', 8),
	('facture_abrege', 8),
	('dossier_id', 8),
	('tiers_id', 8),
	('facture_code', 8),
	('ht_montant', 8),
	('tva_montant', 8),
	('devise_code', 8),
	('facture_date', 8),
	('echeance_date', 8),
	('fournisseur_id', 8),
	('compte_abrege', 8);

INSERT INTO box(idbox, title) VALUES (9, 'FAC_VALORISATION_TIERS');
INSERT INTO field(name, idbox) VALUES
	('id', 9),
	('dossier_id', 9),
	('tiers_id', 9),
	('etape_id', 9),
	('annuite_date_id', 9),
	('facture_id', 9),
	('tarif_id', 9),
	('honoraire_fac_montant', 9),
	('fac_quantite', 9),
	('intervenant_id', 9);

INSERT INTO box(idbox, title) VALUES (10, 'DOS_CARACTERISTIQUE');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 10),
	('caracteristique_code', 10),
	('cre_date', 10);

INSERT INTO box(idbox, title) VALUES (11, 'DOS_NOTE');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 11),
	('note_libelle', 11),
	('id', 11);

INSERT INTO box(idbox, title) VALUES (12, 'FAC_TITRE');
INSERT INTO field(name, idbox) VALUES
	('facture_id', 12),
	('langue_code', 12),
	('titre_commentaire', 12),
	('cre_date', 12),
	('cre_utilisateur', 12),
	('poste_code', 12);

INSERT INTO box(idbox, title) VALUES (13, 'TIE_HISTORIQUE');
INSERT INTO field(name, idbox) VALUES
	('id', 13),
	('tiers_id', 13),
	('rubrique_code', 13),
	('action_code', 13),
	('historique_valeur', 13),
	('cre_date', 13);

INSERT INTO box(idbox, title) VALUES (14, 'DOS_RESPONSABLE');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 14),
	('responsabilite_code', 14),
	('responsable_id', 14),
	('cre_date', 14),
	('cre_utilisateur', 14),
	('maj_date', 14),
	('maj_utilisateur', 14);

INSERT INTO box(idbox, title) VALUES (15, 'FAC_FACTURE_DOSSIER_TRACE');
INSERT INTO field(name, idbox) VALUES
	('facture_trace_id', 15),
	('dossier_id', 15);

INSERT INTO box(idbox, title) VALUES (16, 'FAC_FACTURE_TRACE');
INSERT INTO field(name, idbox) VALUES
	('id', 16),
	('facture_id', 16),
	('abrege_nouveau', 16),
	('maj_utilisateur', 16),
	('maj_date', 16);

INSERT INTO box(idbox, title) VALUES (17, 'DOS_ACTE_DATE');
INSERT INTO field(name, idbox) VALUES
	('acte_id', 17),
	('date_code', 17),
	('date_date', 17),
	('cre_date', 17),
	('cre_utilisateur', 17),
	('maj_date', 17),
	('maj_utilisateur', 17);

INSERT INTO box(idbox, title) VALUES (18, 'DOS_ACTE');
INSERT INTO field(name, idbox) VALUES
	('id', 18),
	('dossier_id', 18),
	('acte_code', 18),
	('commentaire', 18),
	('cre_date', 18),
	('cre_utilisateur', 18);

INSERT INTO box(idbox, title) VALUES (19, 'FAC_DOSSIER');
INSERT INTO field(name, idbox) VALUES
	('facture_id', 19),
	('dossier_id', 19),
	('cre_date', 19),
	('cre_utilisateur', 19);

INSERT INTO box(idbox, title) VALUES (20, 'FAC_FACTURE');
INSERT INTO field(name, idbox) VALUES
	('id', 20),
	('facture_code', 20),
	('facture_date', 20),
	('echeance_date', 20),
	('tiers_id', 20);

INSERT INTO box(idbox, title) VALUES (21, 'FAC_INTERVENANT');
INSERT INTO field(name, idbox) VALUES
	('id', 21),
	('intervenant_id', 21),
	('valorisation_id', 21),
	('dossier_id', 21),
	('tiers_id', 21),
	('etape_id', 21),
	('tarif_id', 21);
	
INSERT INTO box(idbox, title) VALUES (22, 'DOS_ANNUITE_DATE');
INSERT INTO field(name, idbox) VALUES
	('id', 22),
	('annuite_id', 22),
	('date_code', 22),
	('date_date', 22),
	('cre_date', 22),
	('cre_utilisateur', 22),
	('maj_date', 22),
	('maj_utilisateur', 22);

INSERT INTO box(idbox, title) VALUES (23, 'DOS_ETAPE_DELAI_HISTORIQUE');
INSERT INTO field(name, idbox) VALUES
	('etape_id', 23),
	('delai_code', 23),
	('delai_date', 23),
	('motif_valeur', 23),
	('cre_date', 23),
	('cre_utilisateur', 23),
	('maj_date', 23),
	('maj_utilisateur', 23);

INSERT INTO box(idbox, title) VALUES (24, 'FAC_COMMENTAIRE_LIGNE');
INSERT INTO field(name, idbox) VALUES
	('facture_id', 24),
	('commentaire_id', 24),
	('etape_id', 24),
	('ligne_code', 24),
	('ligne_numero', 24),
	('poste_code', 24),
	('poste_presentation_code', 24),
	('langue_code', 24),
	('ligne_valeur', 24),
	('cre_date', 24),
	('cre_utilisateur', 24),
	('maj_date', 24),
	('maj_utilisateur', 24);

INSERT INTO box(idbox, title) VALUES (25, 'DOS_ANNUITE');
INSERT INTO field(name, idbox) VALUES
	('id', 25),
	('dossier_id', 25),
	('etape_id', 25),
	('qt_debut_numero', 25);

INSERT INTO box(idbox, title) VALUES (26, 'DOS_CRITERE');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 26),
	('tiers_id', 26),
	('cre_date', 26),
	('cre_utilisateur', 26),
	('code', 26),
	('critere_code', 26);

INSERT INTO box(idbox, title) VALUES (27, 'DOS_GENERALITE');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 27),
	('code', 27),
	('generalite_nombre', 27),
	('cre_date', 27),
	('cre_utilisateur', 27),
	('generalite_code', 27);
]},
INSERT INTO box(idbox, title) VALUES (28, 'DOS_DOSSIER');
INSERT INTO field(name, idbox) VALUES
	('id', 28),
	('chemise_id', 28),
	('principal_document_id', 28),
	('signataire_inpi_id', 28),
	('service_code', 28),
	('reference_abrege', 28),
	('vtqp_id', 28);

INSERT INTO box(idbox, title) VALUES (29, 'DOS_TITRE');
INSERT INTO field(name, idbox) VALUES
	('dossier_id', 29),
	('langue_code', 29),
	('titre_libelle_long', 29),
	('titre_valeur', 29),
	('cre_date', 29),
	('cre_utilisateur', 29);
]},
INSERT INTO box(idbox, title) VALUES (30, 'COM_UTILISATEUR');
INSERT INTO field(name, idbox) VALUES
	('id', 30),
	('parent_id', 30),
	('code', 30),
	('login', 30),
	('nom', 30),
	('prenom', 30),
	('email', 30),
	('cre_date', 30),
	('cre_utilisateur', 30),
	('actif_flag', 30);
]},
INSERT INTO box(idbox, title) VALUES (31, 'DOS_LIEN');
"id":30,
INSERT INTO field(name, idbox) VALUES
	('code', 31),
	('pere_id', 31),
	('fils_id', 31),
	('cre_date', 31),
	('cre_utilisateur', 31);
]},
INSERT INTO box(idbox, title) VALUES (32, 'DOS_ETAPE_DELAI');
INSERT INTO field(name, idbox) VALUES
	('etape_id', 32),
	('delai_code', 32),
	('delai_date', 32),
	('motif_valeur', 32),
	('cre_date', 32),
	('cre_utilisateur', 32);
]},
INSERT INTO box(idbox, title) VALUES (33, 'DOS_INTERVENANT');
INSERT INTO field(name, idbox) VALUES
	('id', 33),
	('dossier_id', 33),
	('nationalite_code', 33),
	('adresse_reprise', 33),
	('cre_date', 33),
	('cre_utilisateur', 33);
]},
INSERT INTO box(idbox, title) VALUES (34, 'DOS_INSCRIPTION');
INSERT INTO field(name, idbox) VALUES
	('id', 34),
	('acte_id', 34),
	('dossier_inscription_id', 34),
	('inscription_numero', 34);
]},
INSERT INTO box(idbox, title) VALUES (35, 'DOS_ACTE_TIERS');
INSERT INTO field(name, idbox) VALUES
	('id', 35),
	('acte_id', 35),
	('raison_id', 35),
	('tiers_id', 35),
	('code', 35),
	('cre_date', 35),
	('cre_utilisateur', 35);

INSERT INTO box(idbox, title) VALUES (36, 'TIE_TIERS');
INSERT INTO field(name, idbox) VALUES
	('id', 36),
	('nom_abrege', 36),
	('nom_libelle_long', 36),
	('siret', 36),
	('pays_code', 36),
	('chemise_id', 36),
	('numero_tva', 36);

INSERT INTO box(idbox, title) VALUES (37, 'TIE_ADRESSE');
INSERT INTO field(name, idbox) VALUES
	('id', 37),
	('tiers_id', 37);

INSERT INTO box(idbox, title) VALUES (38, 'TIE_COMMUNICATION');
INSERT INTO field(name, idbox) VALUES
	('contact_id', 38),
	('adress_id', 38),
	('type_code', 38),
	('id', 38),
	('numero_libelle_long', 38);

INSERT INTO box(idbox, title) VALUES (39, 'TIE_RAISON_SOCIALE');
INSERT INTO field(name, idbox) VALUES
	('id', 39),
	('tiers_id', 39),
	('raison_sociale_valeur', 39),
	('pays_code', 39);

INSERT INTO box(idbox, title) VALUES (40, 'TIE_NOTE');
INSERT INTO field(name, idbox) VALUES
	('id', 40),
	('tiers_id', 40),
	('note_libelle', 40),
	('note_valeur', 40),
	('type_code', 40);

INSERT INTO box(idbox, title) VALUES (41, 'TIE_CONTACT');
INSERT INTO field(name, idbox) VALUES
	('id', 41),
	('tiers_id', 41),
	('adresse_id', 41),
	('contact_code', 41),
	('nom_libelle', 41),
	('prenom_libelle', 41),
	('fonction_libelle_long', 41);

INSERT INTO box(idbox, title) VALUES (42, 'TIE_GROUPE');
INSERT INTO field(name, idbox) VALUES
	('groupe_tiers_id', 42),
	('type_code', 42),
	('tiers_id', 42),
	('cre_utilisateur', 42),
	('cre_date', 42);

INSERT INTO box(idbox, title) VALUES (43, 'TIE_COMPTABILITE');
INSERT INTO field(name, idbox) VALUES
	('tiers_id', 43),
	('code', 43),
	('comptabilite_abrege', 43),
	('cre_date', 43),
	('cre_utilisateur', 43);

INSERT INTO box(idbox, title) VALUES (44, 'TIE_RESPONSABLE');
INSERT INTO field(name, idbox) VALUES
	('tiers_id', 44),
	('utilisateur_id', 44),
	('responsabilite_code', 44),
	('cre_date', 44),
	('cre_utilisateur', 44);

INSERT INTO box(idbox, title) VALUES (45, 'LEG_VTQP');
INSERT INTO field(name, idbox) VALUES
	('id', 45),
	('objet_code', 45),
	('pays_code', 45),
	('voie_code', 45),
	('type_code', 45),
	('libelle_code', 45),
	('qualificatif_code', 45),
	('particularite_code', 45),
	('date_pivot_code', 45);

INSERT INTO box(idbox, title) VALUES (46, 'DOS_ETAPE_DETAIL');
INSERT INTO field(name, idbox) VALUES
	('etape_id', 46),
	('action_type_code', 46),
	('action_libelle_long', 46),
	('tri_numero', 46);

INSERT INTO box(idbox, title) VALUES (47, 'COM_LIBELLE');
INSERT INTO field(name, idbox) VALUES
	('type_code', 47),
	('langue_code', 47),
	('code', 47),
	('ligne_numero', 47),
	('libelle', 47),
	('libelle_long', 47),
	('commentaire', 47),
	('tri_numero', 47);

INSERT INTO box(idbox, title) VALUES (48, 'TIE_TYPE');
INSERT INTO field(name, idbox) VALUES
	('tiers_id', 48),
	('code', 48);

INSERT INTO box(idbox, title) VALUES (49, 'PAR_GENERALITE');
INSERT INTO field(name, idbox) VALUES
	('code', 49),
	('objet_code', 49),
	('numerique_flag', 49),
	('type_libelle_code', 49);

INSERT INTO box(idbox, title) VALUES (50, 'TIE_CARACTERISTIQUE');
INSERT INTO field(name, idbox) VALUES
	('tiers_id', 50),
	('code', 50),
	('contact_id', 50);

INSERT INTO box(idbox, title) VALUES (51, 'TIE_COURRIER');
INSERT INTO field(name, idbox) VALUES
	('id', 51),
	('portefeuille_id', 51),
	('objet_code', 51),
	('famille_code', 51),
	('courrier_code', 51);

INSERT INTO box(idbox, title) VALUES (52, 'TIE_COURRIER_DETAIL');
INSERT INTO field(name, idbox) VALUES
	('tiers_courrier_id', 52),
	('detail_code', 52),
	('adresse_id', 52),
	('contact_id', 52),
	('langue_code', 52),
	('format_code', 52),
	('type_code', 52);

INSERT INTO box(idbox, title) VALUES (53, 'COM_PARAMETRAGE_FICHE');
INSERT INTO field(name, idbox) VALUES
	('prestation_code', 53),
	('pays_code', 53),
	('fiche_type_code', 53),
	('type_code', 53),
	('code_code', 53),
	('tri_nombre', 53);

INSERT INTO box(idbox, title) VALUES (54, 'PRE_PRESTATION');
INSERT INTO field(name, idbox) VALUES
	('code', 54),
	('objet_code', 54),
	('sequence_libelle_long', 54),
	('taille_compteur_numero', 54),
	('formule_compteur', 54),
	('service_code', 54),
	('nouv_dos_etape_code', 54);

INSERT INTO box(idbox, title) VALUES (55, 'DOS_DOCUMENT');
INSERT INTO field(name, idbox) VALUES
	('DOCUMENT_ID', 55),
	('DOSSIER_ID', 55),
	('FACTURE_ID', 55);

INSERT INTO box(idbox, title) VALUES (56, 'COU_DOCUMENT');

INSERT INTO field(name, idbox) VALUES
	('ID', 56),
	('TYPE_CODE', 56),
	('DERNIERE_VERSION_ID', 56),
	('EXPEDITEUR_ID', 56),
	('TITRE_LIBELLE_ETENDU', 56),
	('INTERNET_FLAG', 56);

INSERT INTO box(idbox, title) VALUES (57, 'COU_DOCUMENT_VERSION');
INSERT INTO field(name, idbox) VALUES
	('ID', 57),
	('DOCUMENT_ID', 57),
	('DOCUMENT_BLOB', 57),
	('FICHIER_COMMENTAIRE', 57),
	('TAILLE_QUANTITE', 57);

INSERT INTO box(idbox, title) VALUES (58, 'COU_DOCUMENT_DESTINATAIRE');
INSERT INTO field(name, idbox) VALUES
	('ID', 58),
	('DOCUMENT_ID', 58),
	('TYPE_CODE', 58),
	('TIERS_ID', 58),
	('TIERS_CODE', 58);

INSERT INTO box(idbox, title) VALUES (59, 'COU_DOCUMENT_LIEN');
INSERT INTO field(name, idbox) VALUES
	('ID', 59),
	('VERSION_ID', 59),
	('DOCUMENT_ID', 59);

INSERT INTO box(idbox, title) VALUES (60, 'COU_DOCUMENT_VERSION_SANSBLOB');
INSERT INTO field(name, idbox) VALUES
	('ID', 60),
	('DOCUMENT_ID', 60),
	('FICHIER_COMMENTAIRE', 60),
	('VISIBLE_FLAG', 60),
	('TAILLE_QUANTITE', 60);

INSERT INTO box(idbox, title) VALUES (61, 'TRF_TARIF');
INSERT INTO field(name, idbox) VALUES
	('id', 61),
	('bareme_code', 61),
	('code', 61)
]},
INSERT INTO box(idbox, title) VALUES (62, 'FAC_ELEC_TMP');
INSERT INTO field(name, idbox) VALUES
	('facture_id', 62),
	('valo_id', 62),
	('nom_colonne', 62),
	('valeur', 62)
]},
INSERT INTO box(idbox, title) VALUES (63, 'TRF_LIGNE');
INSERT INTO field(name, idbox) VALUES
	('tarif_id', 63),
	('type_code', 63),
	('modalite_code', 63),
	('ligne_numero', 63),
	('montant', 63)
]},
INSERT INTO box(idbox, title) VALUES (64, 'DOS_CLASSE');
INSERT INTO field(name, idbox) VALUES
	('ID', 64),
	('DOSSIER_ID', 64),
	('CLASSE_CODE', 64)
]},
INSERT INTO box(idbox, title) VALUES (65, 'ADMIN_SANTA.FAC_PROFORMA_2');
INSERT INTO field(name, idbox) VALUES
	('ID_MERE', 65),
	('PIECE(FG)', 65);

INSERT INTO box(idbox, title) VALUES (66, 'FAC_VALORISATION_FOURNISSEUR');
INSERT INTO field(name, idbox) VALUES
	('VALORISATION_ID', 66),
	('FACTURE_FOURNISSEUR_ID', 66);

INSERT INTO box(idbox, title) VALUES (67, 'FAC_FOURNISSEUR');
INSERT INTO field(name, idbox) VALUES
	('FOURNISSEUR_FACTURE_ABREGE', 67),
	('FOURNISSEUR_ID', 67),
	('FOURNISSEUR_FACTURE_DATE', 67),
	('FOURNISSEUR_TOTAL_MONTANT', 67),
	('ID', 67);

INSERT INTO box(idbox, title) VALUES (68, 'DOS_MODELE');
INSERT INTO field(name, idbox) VALUES
	('ID', 68),
	('DOSSIER_ID', 68),
	('NUMERO_NUMERO', 68),
	('TITRE_VALEUR', 68)
]}],
"values":[
{"box":"FAC_COMPTABLE","field":"type_code","value":"avoir"},
{"box":"FAC_COMPTABLE","field":"type_code","value":"facture"},
{"box":"FAC_COMPTABLE","field":"dossier_id","value":"annuit"},
{"box":"FAC_COMPTABLE","field":"dossier_id","value":"proced"},
{"box":"DOS_NOTE","field":"dossier_id","value":"agent"},
{"box":"DOS_NOTE","field":"dossier_id","value":"image"},
{"box":"DOS_NOTE","field":"dossier_id","value":"status"},
{"box":"TIE_HISTORIQUE","field":"id","value":"adress"},
{"box":"TIE_HISTORIQUE","field":"id","value":"note"},
{"box":"TIE_HISTORIQUE","field":"id","value":"portef"},
{"box":"TIE_HISTORIQUE","field":"id","value":"raisoc"},
{"box":"TIE_HISTORIQUE","field":"id","value":"tiers"},
{"box":"TIE_HISTORIQUE","field":"id","value":"type"},
{"box":"TIE_HISTORIQUE","field":"action_code","value":"ajout"},
{"box":"TIE_HISTORIQUE","field":"action_code","value":"modif"},
{"box":"TIE_HISTORIQUE","field":"action_code","value":"suppr"},
{"box":"DOS_RESPONSABLE","field":"dossier_id","value":"admtra"},
{"box":"DOS_RESPONSABLE","field":"dossier_id","value":"ingen"},
{"box":"DOS_RESPONSABLE","field":"dossier_id","value":"ingres"},
{"box":"DOS_RESPONSABLE","field":"dossier_id","value":"ingtra"},
{"box":"DOS_RESPONSABLE","field":"dossier_id","value":"resadm"},
{"box":"DOS_ACTE_DATE","field":"acte_id","value":"acte"},
{"box":"DOS_ACTE","field":"acte_code","value":"cessio"},
{"box":"DOS_ACTE","field":"acte_code","value":"chgrs"},
{"box":"DOS_ACTE","field":"acte_code","value":"dep"},
{"box":"FAC_FACTURE","field":"facture_code","value":"annuit"},
{"box":"FAC_FACTURE","field":"facture_code","value":"proced"},
{"box":"DOS_ANNUITE_DATE","field":"annuite_id","value":"facann"},
{"box":"DOS_ANNUITE_DATE","field":"annuite_id","value":"orclan"},
{"box":"DOS_ANNUITE_DATE","field":"annuite_id","value":"relann"},
{"box":"DOS_ETAPE_DELAI_HISTORIQUE","field":"delai_code","value":"client"},
{"box":"DOS_ETAPE_DELAI_HISTORIQUE","field":"delai_code","value":"derdel"},
{"box":"DOS_ETAPE_DELAI_HISTORIQUE","field":"delai_code","value":"intern"},
{"box":"DOS_ETAPE_DELAI_HISTORIQUE","field":"delai_code","value":"offici"},
{"box":"FAC_COMMENTAIRE_LIGNE","field":"commentaire_id","value":"commen"},
{"box":"FAC_COMMENTAIRE_LIGNE","field":"commentaire_id","value":"sousto"},
{"box":"DOS_DOSSIER","field":"service_code","value":"brevet"},
{"box":"DOS_DOSSIER","field":"service_code","value":"depetr"},
{"box":"DOS_DOSSIER","field":"service_code","value":"sgegco"},
{"box":"DOS_ACTE_TIERS","field":"code","value":"ajout"},
{"box":"DOS_ACTE_TIERS","field":"code","value":"modif"},
{"box":"DOS_ACTE_TIERS","field":"code","value":"suppr"},
{"box":"TIE_COMMUNICATION","field":"type_code","value":"email"},
{"box":"TIE_COMMUNICATION","field":"type_code","value":"fax"},
{"box":"TIE_COMMUNICATION","field":"type_code","value":"telbur"},
{"box":"TIE_GROUPE","field":"type_code","value":"financ"},
{"box":"TIE_GROUPE","field":"type_code","value":"legal"},
{"box":"TIE_COMPTABILITE","field":"code","value":"client"},
{"box":"TIE_COMPTABILITE","field":"code","value":"fourni"},
{"box":"TIE_RESPONSABLE","field":"responsabilite_code","value":"admtra"},
{"box":"TIE_RESPONSABLE","field":"responsabilite_code","value":"associ"},
{"box":"TIE_RESPONSABLE","field":"responsabilite_code","value":"ingen"},
{"box":"TIE_RESPONSABLE","field":"responsabilite_code","value":"ingres"},
{"box":"TIE_RESPONSABLE","field":"responsabilite_code","value":"jurres"},
{"box":"TIE_RESPONSABLE","field":"responsabilite_code","value":"resadm"},
{"box":"TIE_TYPE","field":"code","value":"CLIDIR"},
{"box":"TIE_TYPE","field":"code","value":"CORCLI"},
{"box":"TIE_TYPE","field":"code","value":"TITU"},
{"box":"PAR_GENERALITE","field":"numerique_flag","value":"N"},
{"box":"PAR_GENERALITE","field":"numerique_flag","value":"O"},
{"box":"TIE_NOTE","field":"type_code","value":"compta"},
{"box":"TIE_NOTE","field":"type_code","value":"normal"}],
"boxComments":[
{"box":"DOS_ETAPE","comment":"permet de savoir ce qu il y a de lance sur un dossier"},
{"box":"DOS_ETAPE_DETAIL","comment":"pour tous les delais passes (ceux qui ont deja ete realise sur un dossier).\\nunique(etape_id, tri_numero)"},
{"box":"DOS_ETAPE_DELAI","comment":"pour tous les delais en cours sur un dossier.\\nunique(etape_id, delai_code)"},
{"box":"DOS_INTERVENANT","comment":"lien entre le dossier et le ou les inventeurs"},
{"box":"DOS_TIERS","comment":"unique(dossier_id, code, classement_numero)"},
{"box":"DOS_ANNUITE","comment":"unique(dossier_id, qt_debut_numero)"},
{"box":"TIE_TIERS","comment":"unique(nom_abrege)"},
{"box":"LEG_VTQP","comment":"unique(objet_code, pays_code, voie_code, type_code, qualificatif_code, particularite_code, date_pivot_code)"},
{"box":"COM_UTILISATEUR","comment":"unique(code)"},
{"box":"TIE_PORTEFEUILLE","comment":"unique(libelle_long, tiers_id)\\nunique(tiers_id, tri_numero)"},
{"box":"DOS_GENERALITE","comment":"Should have a constraint UNIQUE(DOSSIER_ID, CODE), but already has some inconsistent data.\\nDOSSIER_ID CODE\\n110677236 ssiprm\\n110677236 SSIPRM\\npreventing the late constraint creation.\\nTo speed things up in otherwise slow common table expression, had to add an index:\\nCREATE NONCLUSTERED INDEX Idx_gen_dossierid_code   \\n    ON DOS_GENERALITE(DOSSIER_ID, CODE) "},
{"box":"COM_LIBELLE","comment":"unique(type_code, langue_code, code, ligne_numero)"},
{"box":"TIE_CARACTERISTIQUE","comment":"unique index (contact_id, code, tiers_id)"},
{"box":"TIE_COURRIER","comment":"unique index (portefeuille_id, objet_code, famille_code, courrier_code)"},
{"box":"TIE_COURRIER_DETAIL","comment":"unique index (tiers_courrier_id, detail_code, adresse_id, contact_id, communication_id)"},
{"box":"COM_PARAMETRAGE_FICHE","comment":"unique(prestation_code, pays_code, fiche_type_code, type_code, code_code)"}],
"fieldComments":[
{"box":"DOS_TIERS","field":"reference_libelle","comment":"may hold CAPEX/OPEX information on lines that have CODE=CPT."}],
"links":[
{"from":52,"fromField":4,"fromCardinality":"NULL","to":48,"toField":0,"toCardinality":"NULL","category":""},
{"from":52,"fromField":4,"fromCardinality":"NULL","to":53,"toField":0,"toCardinality":"NULL","category":""},
{"from":29,"fromField":1,"fromCardinality":"NULL","to":29,"toField":0,"toCardinality":"NULL","category":""},
{"from":55,"fromField":2,"fromCardinality":"NULL","to":56,"toField":0,"toCardinality":"NULL","category":""},
{"from":57,"fromField":3,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":58,"fromField":1,"fromCardinality":"NULL","to":56,"toField":0,"toCardinality":"NULL","category":""},
{"from":17,"fromField":1,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":16,"fromField":0,"fromCardinality":"NULL","to":17,"toField":0,"toCardinality":"NULL","category":""},
{"from":34,"fromField":1,"fromCardinality":"NULL","to":17,"toField":0,"toCardinality":"NULL","category":""},
{"from":34,"fromField":2,"fromCardinality":"NULL","to":38,"toField":0,"toCardinality":"NULL","category":""},
{"from":34,"fromField":3,"fromCardinality":"NULL","to":3,"toField":-1,"toCardinality":"NULL","category":""},
{"from":24,"fromField":1,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":24,"fromField":2,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":21,"fromField":1,"fromCardinality":"NULL","to":24,"toField":0,"toCardinality":"NULL","category":""},
{"from":9,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":25,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":25,"fromField":1,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":1,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":1,"fromField":11,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":54,"fromField":1,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":27,"fromField":6,"fromCardinality":"NULL","to":44,"toField":0,"toCardinality":"NULL","category":""},
{"from":0,"fromField":2,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":0,"fromField":1,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":0,"fromField":6,"fromCardinality":"NULL","to":29,"toField":0,"toCardinality":"NULL","category":""},
{"from":31,"fromField":0,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":22,"fromField":0,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":45,"fromField":0,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":26,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":33,"fromField":1,"fromCardinality":"NULL","to":17,"toField":0,"toCardinality":"NULL","category":""},
{"from":32,"fromField":1,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":30,"fromField":2,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":30,"fromField":1,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":10,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":13,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":13,"fromField":2,"fromCardinality":"NULL","to":29,"toField":0,"toCardinality":"NULL","category":""},
{"from":3,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":3,"fromField":2,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":28,"fromField":0,"fromCardinality":"NULL","to":27,"toField":0,"toCardinality":"NULL","category":""},
{"from":23,"fromField":1,"fromCardinality":"NULL","to":23,"toField":1,"toCardinality":"NULL","category":""},
{"from":23,"fromField":2,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":23,"fromField":0,"fromCardinality":"NULL","to":19,"toField":0,"toCardinality":"NULL","category":""},
{"from":7,"fromField":4,"fromCardinality":"NULL","to":18,"toField":1,"toCardinality":"NULL","category":""},
{"from":7,"fromField":1,"fromCardinality":"NULL","to":19,"toField":0,"toCardinality":"NULL","category":""},
{"from":7,"fromField":5,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":2,"fromField":0,"fromCardinality":"NULL","to":7,"toField":0,"toCardinality":"NULL","category":""},
{"from":6,"fromField":1,"fromCardinality":"NULL","to":2,"toField":6,"toCardinality":"NULL","category":""},
{"from":18,"fromField":1,"fromCardinality":"NULL","to":18,"toField":1,"toCardinality":"NULL","category":""},
{"from":18,"fromField":0,"fromCardinality":"NULL","to":19,"toField":0,"toCardinality":"NULL","category":""},
{"from":19,"fromField":4,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":14,"fromField":1,"fromCardinality":"NULL","to":18,"toField":1,"toCardinality":"NULL","category":""},
{"from":14,"fromField":0,"fromCardinality":"NULL","to":15,"toField":0,"toCardinality":"NULL","category":""},
{"from":15,"fromField":1,"fromCardinality":"NULL","to":19,"toField":0,"toCardinality":"NULL","category":""},
{"from":20,"fromField":3,"fromCardinality":"NULL","to":18,"toField":1,"toCardinality":"NULL","category":""},
{"from":20,"fromField":5,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":20,"fromField":4,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":11,"fromField":0,"fromCardinality":"NULL","to":19,"toField":0,"toCardinality":"NULL","category":""},
{"from":8,"fromField":4,"fromCardinality":"NULL","to":21,"toField":0,"toCardinality":"NULL","category":""},
{"from":8,"fromField":1,"fromCardinality":"NULL","to":18,"toField":1,"toCardinality":"NULL","category":""},
{"from":8,"fromField":3,"fromCardinality":"NULL","to":0,"toField":0,"toCardinality":"NULL","category":""},
{"from":8,"fromField":2,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":48,"fromField":0,"fromCardinality":"NULL","to":26,"toField":1,"toCardinality":"NULL","category":""},
{"from":36,"fromField":1,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":49,"fromField":2,"fromCardinality":"NULL","to":40,"toField":0,"toCardinality":"NULL","category":""},
{"from":49,"fromField":0,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":37,"fromField":1,"fromCardinality":"NULL","to":36,"toField":0,"toCardinality":"NULL","category":""},
{"from":37,"fromField":0,"fromCardinality":"NULL","to":40,"toField":0,"toCardinality":"NULL","category":""},
{"from":42,"fromField":0,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":40,"fromField":2,"fromCardinality":"NULL","to":36,"toField":0,"toCardinality":"NULL","category":""},
{"from":40,"fromField":2,"fromCardinality":"NULL","to":36,"toField":0,"toCardinality":"NULL","category":""},
{"from":40,"fromField":1,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":50,"fromField":1,"fromCardinality":"NULL","to":5,"toField":0,"toCardinality":"NULL","category":""},
{"from":51,"fromField":2,"fromCardinality":"NULL","to":36,"toField":0,"toCardinality":"NULL","category":""},
{"from":51,"fromField":3,"fromCardinality":"NULL","to":40,"toField":0,"toCardinality":"NULL","category":""},
{"from":51,"fromField":0,"fromCardinality":"NULL","to":50,"toField":0,"toCardinality":"NULL","category":""},
{"from":4,"fromField":0,"fromCardinality":"NULL","to":5,"toField":0,"toCardinality":"NULL","category":""},
{"from":41,"fromField":2,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":12,"fromField":1,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":39,"fromField":1,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":5,"fromField":1,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":38,"fromField":1,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":43,"fromField":0,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":43,"fromField":1,"fromCardinality":"NULL","to":29,"toField":0,"toCardinality":"NULL","category":""},
{"from":47,"fromField":0,"fromCardinality":"NULL","to":35,"toField":0,"toCardinality":"NULL","category":""},
{"from":59,"fromField":1,"fromCardinality":"","to":55,"toField":0,"toCardinality":"","category":""},
{"from":8,"fromField":5,"fromCardinality":"","to":19,"toField":0,"toCardinality":"","category":"TR2"},
{"from":8,"fromField":6,"fromCardinality":"","to":60,"toField":0,"toCardinality":"","category":""},
{"from":61,"fromField":0,"fromCardinality":"","to":19,"toField":0,"toCardinality":"","category":""},
{"from":61,"fromField":1,"fromCardinality":"","to":8,"toField":0,"toCardinality":"","category":""},
{"from":8,"fromField":9,"fromCardinality":"","to":29,"toField":0,"toCardinality":"","category":""},
{"from":62,"fromField":0,"fromCardinality":"","to":60,"toField":0,"toCardinality":"","category":""},
{"from":27,"fromField":2,"fromCardinality":"","to":55,"toField":0,"toCardinality":"","category":""},
{"from":63,"fromField":1,"fromCardinality":"","to":27,"toField":0,"toCardinality":"","category":""},
{"from":56,"fromField":1,"fromCardinality":"","to":55,"toField":0,"toCardinality":"","category":""},
{"from":54,"fromField":0,"fromCardinality":"","to":55,"toField":0,"toCardinality":"","category":""},
{"from":58,"fromField":2,"fromCardinality":"","to":55,"toField":0,"toCardinality":"","category":""},
{"from":57,"fromField":1,"fromCardinality":"","to":55,"toField":0,"toCardinality":"","category":""},
{"from":64,"fromField":0,"fromCardinality":"","to":19,"toField":0,"toCardinality":"","category":""},
{"from":65,"fromField":0,"fromCardinality":"","to":8,"toField":0,"toCardinality":"","category":""},
{"from":66,"fromField":1,"fromCardinality":"","to":35,"toField":0,"toCardinality":"","category":""},
{"from":65,"fromField":1,"fromCardinality":"","to":66,"toField":4,"toCardinality":"","category":""},
{"from":67,"fromField":1,"fromCardinality":"","to":27,"toField":0,"toCardinality":"","category":""}],
"fieldColors":[
{"box":"COM_LIBELLE","field":"code","color":"yellow"},
{"box":"COM_LIBELLE","field":"type_code","color":"yellow"},
{"box":"TIE_TYPE","field":"code","color":"yellow"},
{"box":"TIE_COMPTABILITE","field":"code","color":"yellow"},
{"box":"TIE_HISTORIQUE","field":"action_code","color":"yellow"},
{"box":"TIE_HISTORIQUE","field":"rubrique_code","color":"yellow"},
{"box":"TIE_RAISON_SOCIALE","field":"id","color":"red"},
{"box":"TIE_RAISON_SOCIALE","field":"pays_code","color":"yellow"},
{"box":"TIE_TIERS","field":"id","color":"skyblue"},
{"box":"TIE_RESPONSABLE","field":"responsabilite_code","color":"yellow"},
{"box":"COM_UTILISATEUR","field":"id","color":"pink"},
{"box":"COM_UTILISATEUR","field":"code","color":"yellow"},
{"box":"TIE_CRITERE","field":"critere_code","color":"yellow"},
{"box":"TIE_COMMUNICATION","field":"type_code","color":"yellow"},
{"box":"TIE_CONTACT","field":"contact_code","color":"yellow"},
{"box":"FAC_TITRE","field":"langue_code","color":"yellow"},
{"box":"FAC_TITRE","field":"poste_code","color":"yellow"},
{"box":"FAC_FACTURE_DOSSIER_TRACE","field":"dossier_id","color":"palegreen"},
{"box":"FAC_FACTURE","field":"facture_code","color":"yellow"},
{"box":"FAC_FACTURE","field":"tiers_id","color":"skyblue"},
{"box":"FAC_COMMENTAIRE_LIGNE","field":"etape_id","color":"olive"},
{"box":"FAC_COMMENTAIRE_LIGNE","field":"ligne_code","color":"yellow"},
{"box":"FAC_COMMENTAIRE_LIGNE","field":"ligne_numero","color":"yellow"},
{"box":"FAC_COMMENTAIRE_LIGNE","field":"poste_code","color":"yellow"},
{"box":"FAC_COMMENTAIRE_LIGNE","field":"poste_presentation_code","color":"yellow"},
{"box":"FAC_INTERVENANT","field":"dossier_id","color":"palegreen"},
{"box":"FAC_INTERVENANT","field":"tiers_id","color":"skyblue"},
{"box":"FAC_INTERVENANT","field":"etape_id","color":"olive"},
{"box":"FAC_DOSSIER","field":"dossier_id","color":"palegreen"},
{"box":"FAC_COMPTABLE","field":"type_code","color":"yellow"},
{"box":"FAC_COMPTABLE","field":"dossier_id","color":"palegreen"},
{"box":"FAC_COMPTABLE","field":"tiers_id","color":"skyblue"},
{"box":"FAC_COMPTABLE","field":"facture_code","color":"yellow"},
{"box":"FAC_COMPTABLE_LIGNE_DETAIL","field":"poste_code","color":"yellow"},
{"box":"FAC_COMPTABLE_LIGNE_DETAIL","field":"ligne_code","color":"yellow"},
{"box":"FAC_COMPTABLE_LIGNE","field":"poste_code","color":"yellow"},
{"box":"FAC_COMPTABLE_LIGNE","field":"ligne_code","color":"yellow"},
{"box":"DOS_ANNUITE_DATE","field":"annuite_id","color":"olive"},
{"box":"DOS_ANNUITE_DATE","field":"date_date","color":"yellow"},
{"box":"FAC_VALORISATION_TIERS","field":"dossier_id","color":"palegreen"},
{"box":"FAC_VALORISATION_TIERS","field":"tiers_id","color":"skyblue"},
{"box":"FAC_VALORISATION_TIERS","field":"etape_id","color":"olive"},
{"box":"DOS_INTERVENANT","field":"nationalite_code","color":"yellow"},
{"box":"DOS_GENERALITE","field":"code","color":"yellow"},
{"box":"DOS_CRITERE","field":"tiers_id","color":"skyblue"},
{"box":"DOS_CRITERE","field":"code","color":"yellow"},
{"box":"DOS_TITRE","field":"langue_code","color":"yellow"},
{"box":"DOS_TIERS","field":"code","color":"yellow"},
{"box":"DOS_TIERS","field":"tiers_id","color":"skyblue"},
{"box":"DOS_CARACTERISTIQUE","field":"caracteristique_code","color":"yellow"},
{"box":"DOS_LIEN","field":"code","color":"yellow"},
{"box":"DOS_DOSSIER","field":"id","color":"palegreen"},
{"box":"DOS_DOSSIER","field":"service_code","color":"yellow"},
{"box":"DOS_DOSSIER","field":"vtqp_id","color":"orange"},
{"box":"DOS_ANNUITE","field":"id","color":"grey"},
{"box":"DOS_ETAPE_DELAI","field":"delai_code","color":"yellow"},
{"box":"DOS_RESPONSABLE","field":"responsabilite_code","color":"yellow"},
{"box":"DOS_RESPONSABLE","field":"responsable_id","color":"hotpink"},
{"box":"LEG_VTQP","field":"id","color":"orange"},
{"box":"LEG_VTQP","field":"pays_code","color":"yellow"},
{"box":"LEG_VTQP","field":"type_code","color":"yellow"},
{"box":"DOS_DATE","field":"code","color":"yellow"},
{"box":"DOS_ETAPE","field":"etape_code","color":"yellow"},
{"box":"DOS_ETAPE","field":"responsable_id","color":"hotpink"},
{"box":"DOS_ETAPE","field":"service_code","color":"yellow"},
{"box":"DOS_ETAPE_DETAIL","field":"action_type_code","color":"yellow"},
{"box":"DOS_ETAPE_DELAI_HISTORIQUE","field":"delai_code","color":"yellow"},
{"box":"COM_LIBELLE","field":"langue_code","color":"yellow"},
{"box":"COM_LIBELLE","field":"ligne_numero","color":"yellow"},
{"box":"DOS_ACTE","field":"dossier_id","color":"palegreen"},
{"box":"DOS_ACTE","field":"acte_code","color":"yellow"},
{"box":"DOS_ACTE_TIERS","field":"raison_id","color":"red"},
{"box":"DOS_ACTE_TIERS","field":"tiers_id","color":"skyblue"},
{"box":"DOS_ACTE_TIERS","field":"code","color":"yellow"},
{"box":"DOS_ACTE_DATE","field":"date_code","color":"yellow"},
{"box":"DOS_ETAPE","field":"id","color":"olive"},
{"box":"TIE_CARACTERISTIQUE","field":"code","color":"yellow"},
{"box":"PAR_GENERALITE","field":"code","color":"yellow"},
{"box":"DOS_GENERALITE","field":"generalite_code","color":"yellow"},
{"box":"PAR_GENERALITE","field":"type_libelle_code","color":"yellow"},
{"box":"TIE_COURRIER","field":"objet_code","color":"yellow"},
{"box":"TIE_COURRIER","field":"famille_code","color":"yellow"},
{"box":"TIE_COURRIER","field":"courrier_code","color":"yellow"},
{"box":"TIE_COURRIER_DETAIL","field":"detail_code","color":"yellow"},
{"box":"TIE_COURRIER_DETAIL","field":"langue_code","color":"yellow"},
{"box":"TIE_COURRIER_DETAIL","field":"format_code","color":"yellow"},
{"box":"TIE_COURRIER_DETAIL","field":"type_code","color":"yellow"},
{"box":"COM_PARAMETRAGE_FICHE","field":"prestation_code","color":"yellow"},
{"box":"COM_PARAMETRAGE_FICHE","field":"pays_code","color":"yellow"},
{"box":"COM_PARAMETRAGE_FICHE","field":"fiche_type_code","color":"yellow"},
{"box":"COM_PARAMETRAGE_FICHE","field":"code_code","color":"yellow"},
{"box":"COM_PARAMETRAGE_FICHE","field":"type_code","color":"yellow"},
{"box":"PRE_PRESTATION","field":"code","color":"yellow"},
{"box":"PRE_PRESTATION","field":"objet_code","color":"yellow"},
{"box":"PRE_PRESTATION","field":"service_code","color":"yellow"},
{"box":"PRE_PRESTATION","field":"nouv_dos_etape_code","color":"yellow"},
{"box":"PAR_GENERALITE","field":"objet_code","color":"yellow"},
{"box":"TRF_TARIF","field":"code","color":"yellow"}
]},"contexts":{"contexts":[{
"frame":
{"left":0,"right":941,"top":0,"bottom":597},
"translatedBoxes":[
{"id":4,"translation":{"x":764,"y":166}},
{"id":5,"translation":{"x":474,"y":189}},
{"id":12,"translation":{"x":273,"y":42}},
{"id":29,"translation":{"x":628,"y":30}},
{"id":35,"translation":{"x":282,"y":212}},
{"id":36,"translation":{"x":473,"y":305}},
{"id":37,"translation":{"x":598,"y":306}},
{"id":38,"translation":{"x":41,"y":306}},
{"id":39,"translation":{"x":37,"y":172}},
{"id":40,"translation":{"x":383,"y":401}},
{"id":41,"translation":{"x":30,"y":427}},
{"id":42,"translation":{"x":67,"y":49}},
{"id":43,"translation":{"x":453,"y":75}},
{"id":47,"translation":{"x":163,"y":237}},
{"id":49,"translation":{"x":192,"y":449}},
{"id":50,"translation":{"x":765,"y":283}},
{"id":51,"translation":{"x":673,"y":431}}
],
"links":[
{"polyline":[{"x":473,"y":326},{"x":415,"y":326}],"from":36,"to":35},
{"polyline":[{"x":333,"y":485},{"x":383,"y":485}],"from":49,"to":40},
{"polyline":[{"x":307,"y":449},{"x":307,"y":348}],"from":49,"to":35},
{"polyline":[{"x":598,"y":333},{"x":558,"y":333}],"from":37,"to":36},
{"polyline":[{"x":598,"y":405},{"x":551,"y":405}],"from":37,"to":40},
{"polyline":[{"x":181,"y":153},{"x":181,"y":187},{"x":288,"y":187},{"x":288,"y":212}],"from":42,"to":35},
{"polyline":[{"x":512,"y":401},{"x":512,"y":361}],"from":40,"to":36},
{"polyline":[{"x":399,"y":401},{"x":399,"y":348}],"from":40,"to":35},
{"polyline":[{"x":765,"y":288},{"x":594,"y":288}],"from":50,"to":5},
{"polyline":[{"x":673,"y":440},{"x":578,"y":440},{"x":578,"y":348},{"x":558,"y":348}],"from":51,"to":36},
{"polyline":[{"x":673,"y":493},{"x":551,"y":493}],"from":51,"to":40},
{"polyline":[{"x":789,"y":431},{"x":789,"y":387}],"from":51,"to":50},
{"polyline":[{"x":764,"y":242},{"x":594,"y":242}],"from":4,"to":5},
{"polyline":[{"x":156,"y":438},{"x":245,"y":438},{"x":245,"y":335},{"x":282,"y":335}],"from":41,"to":35},
{"polyline":[{"x":330,"y":162},{"x":330,"y":212}],"from":12,"to":35},
{"polyline":[{"x":142,"y":224},{"x":282,"y":224}],"from":39,"to":35},
{"polyline":[{"x":474,"y":252},{"x":415,"y":252}],"from":5,"to":35},
{"polyline":[{"x":209,"y":314},{"x":282,"y":314}],"from":38,"to":35},
{"polyline":[{"x":453,"y":170},{"x":390,"y":170},{"x":390,"y":212}],"from":43,"to":35},
{"polyline":[{"x":607,"y":127},{"x":628,"y":127}],"from":43,"to":29},
{"polyline":[{"x":240,"y":265},{"x":282,"y":265}],"from":47,"to":35}
]},{
"frame":
{"left":-59,"right":846,"top":-70,"bottom":697},
"translatedBoxes":[
{"id":66,"translation":{"x":0,"y":0}},
{"id":65,"translation":{"x":-29,"y":599}},
{"id":64,"translation":{"x":567,"y":189}},
{"id":62,"translation":{"x":594,"y":563}},
{"id":61,"translation":{"x":605,"y":450}},
{"id":60,"translation":{"x":423,"y":586}},
{"id":2,"translation":{"x":592,"y":273}},
{"id":6,"translation":{"x":626,"y":42}},
{"id":7,"translation":{"x":413,"y":349}},
{"id":8,"translation":{"x":209,"y":466}},
{"id":11,"translation":{"x":241,"y":32}},
{"id":14,"translation":{"x":30,"y":176}},
{"id":15,"translation":{"x":244,"y":188}},
{"id":18,"translation":{"x":245,"y":334}},
{"id":19,"translation":{"x":411,"y":190}},
{"id":20,"translation":{"x":50,"y":264}},
{"id":21,"translation":{"x":43,"y":430}},
{"id":23,"translation":{"x":429,"y":-40}}
],
"links":[
{"polyline":[{"x":520,"y":4056},{"x":520,"y":2361},{"x":412,"y":2361},{"x":412,"y":294}],"from":23,"to":19},
{"polyline":[{"x":413,"y":385},{"x":371,"y":385}],"from":7,"to":18},
{"polyline":[{"x":468,"y":349},{"x":468,"y":294}],"from":7,"to":19},
{"polyline":[{"x":592,"y":379},{"x":532,"y":379}],"from":2,"to":7},
{"polyline":[{"x":786,"y":162},{"x":786,"y":341},{"x":733,"y":341}],"from":6,"to":2},
{"polyline":[{"x":339,"y":334},{"x":339,"y":314},{"x":412,"y":314},{"x":412,"y":294}],"from":18,"to":19},
{"polyline":[{"x":213,"y":211},{"x":228,"y":211},{"x":228,"y":313},{"x":276,"y":313},{"x":276,"y":334}],"from":14,"to":18},
{"polyline":[{"x":213,"y":189},{"x":244,"y":189}],"from":14,"to":15},
{"polyline":[{"x":371,"y":241},{"x":411,"y":241}],"from":15,"to":19},
{"polyline":[{"x":176,"y":367},{"x":245,"y":367}],"from":20,"to":18},
{"polyline":[{"x":321,"y":152},{"x":321,"y":170},{"x":467,"y":170},{"x":467,"y":190}],"from":11,"to":19},
{"polyline":[{"x":209,"y":524},{"x":169,"y":524}],"from":8,"to":21},
{"polyline":[{"x":308,"y":466},{"x":308,"y":422}],"from":8,"to":18},
{"polyline":[{"x":377,"y":618},{"x":423,"y":618}],"from":8,"to":60},
{"polyline":[{"x":664,"y":450},{"x":664,"y":429},{"x":562,"y":429},{"x":562,"y":321},{"x":497,"y":321},{"x":497,"y":294}],"from":61,"to":19},
{"polyline":[{"x":664,"y":538},{"x":664,"y":556},{"x":377,"y":556}],"from":61,"to":8},
{"polyline":[{"x":594,"y":622},{"x":521,"y":622}],"from":62,"to":60},
{"polyline":[{"x":567,"y":217},{"x":523,"y":217}],"from":64,"to":19},
{"polyline":[{"x":4067,"y":627},{"x":2397,"y":627},{"x":2397,"y":556},{"x":377,"y":556}],"from":65,"to":8},
{"polyline":[{"x":4067,"y":627},{"x":2397,"y":627},{"x":2397,"y":169},{"x":101,"y":169},{"x":101,"y":104}],"from":65,"to":66}
]},{
"frame":
{"left":0,"right":1036,"top":0,"bottom":789},
"translatedBoxes":[
{"id":67,"translation":{"x":52,"y":32}},
{"id":0,"translation":{"x":622,"y":507}},
{"id":1,"translation":{"x":434,"y":523}},
{"id":3,"translation":{"x":796,"y":187}},
{"id":9,"translation":{"x":30,"y":377}},
{"id":10,"translation":{"x":611,"y":321}},
{"id":13,"translation":{"x":78,"y":566}},
{"id":22,"translation":{"x":811,"y":589}},
{"id":24,"translation":{"x":610,"y":398}},
{"id":25,"translation":{"x":457,"y":161}},
{"id":27,"translation":{"x":358,"y":310}},
{"id":28,"translation":{"x":618,"y":153}},
{"id":30,"translation":{"x":51,"y":455}},
{"id":31,"translation":{"x":771,"y":350}},
{"id":32,"translation":{"x":49,"y":249}},
{"id":45,"translation":{"x":824,"y":486}},
{"id":26,"translation":{"x":414,"y":30}},
{"id":44,"translation":{"x":279,"y":591}},
{"id":52,"translation":{"x":32,"y":123}},
{"id":53,"translation":{"x":225,"y":31}},
{"id":48,"translation":{"x":257,"y":201}}
],
"links":[
{"polyline":[{"x":187,"y":222},{"x":257,"y":222}],"from":52,"to":48},
{"polyline":[{"x":187,"y":145},{"x":225,"y":145}],"from":52,"to":53},
{"polyline":[{"x":610,"y":422},{"x":526,"y":422}],"from":24,"to":27},
{"polyline":[{"x":679,"y":486},{"x":679,"y":507}],"from":24,"to":0},
{"polyline":[{"x":212,"y":387},{"x":358,"y":387}],"from":9,"to":27},
{"polyline":[{"x":491,"y":281},{"x":491,"y":310}],"from":25,"to":27},
{"polyline":[{"x":480,"y":523},{"x":480,"y":446}],"from":1,"to":27},
{"polyline":[{"x":602,"y":615},{"x":622,"y":615}],"from":1,"to":0},
{"polyline":[{"x":392,"y":446},{"x":392,"y":591}],"from":27,"to":44},
{"polyline":[{"x":636,"y":507},{"x":636,"y":496},{"x":568,"y":496},{"x":568,"y":436},{"x":526,"y":436}],"from":0,"to":27},
{"polyline":[{"x":780,"y":470},{"x":780,"y":507}],"from":31,"to":0},
{"polyline":[{"x":811,"y":648},{"x":790,"y":648}],"from":22,"to":0},
{"polyline":[{"x":824,"y":540},{"x":790,"y":540}],"from":45,"to":0},
{"polyline":[{"x":437,"y":150},{"x":437,"y":310}],"from":26,"to":27},
{"polyline":[{"x":182,"y":344},{"x":358,"y":344}],"from":32,"to":27},
{"polyline":[{"x":198,"y":462},{"x":305,"y":462},{"x":305,"y":421},{"x":358,"y":421}],"from":30,"to":27},
{"polyline":[{"x":611,"y":357},{"x":526,"y":357}],"from":10,"to":27},
{"polyline":[{"x":253,"y":578},{"x":305,"y":578},{"x":305,"y":421},{"x":358,"y":421}],"from":13,"to":27},
{"polyline":[{"x":796,"y":320},{"x":526,"y":320}],"from":3,"to":27},
{"polyline":[{"x":702,"y":273},{"x":702,"y":314},{"x":526,"y":314}],"from":28,"to":27},
{"polyline":[{"x":327,"y":201},{"x":327,"y":184},{"x":416,"y":184},{"x":416,"y":150}],"from":48,"to":26},
{"polyline":[{"x":164,"y":76},{"x":206,"y":76},{"x":206,"y":314},{"x":358,"y":314}],"from":67,"to":27}
]},{
"frame":
{"left":0,"right":499,"top":-74,"bottom":378},
"translatedBoxes":[
{"id":63,"translation":{"x":170,"y":-44}},
{"id":16,"translation":{"x":343,"y":212}},
{"id":17,"translation":{"x":165,"y":74}},
{"id":33,"translation":{"x":132,"y":243}},
{"id":34,"translation":{"x":335,"y":30}},
{"id":46,"translation":{"x":30,"y":37}}
],
"links":[
{"polyline":[{"x":343,"y":227},{"x":317,"y":227},{"x":317,"y":180},{"x":291,"y":180}],"from":16,"to":17},
{"polyline":[{"x":335,"y":120},{"x":291,"y":120}],"from":34,"to":17},
{"polyline":[{"x":228,"y":243},{"x":228,"y":194}],"from":33,"to":17}
]},{
"frame":
{"left":-25,"right":445,"top":-161,"bottom":293},
"translatedBoxes":[
{"id":59,"translation":{"x":147,"y":-131}},
{"id":54,"translation":{"x":10,"y":-122}},
{"id":55,"translation":{"x":6,"y":-5}},
{"id":56,"translation":{"x":5,"y":159}},
{"id":57,"translation":{"x":232,"y":6}},
{"id":58,"translation":{"x":221,"y":164}}
],
"links":[
{"polyline":[{"x":8,"y":4091},{"x":8,"y":263}],"from":55,"to":56},
{"polyline":[{"x":221,"y":182},{"x":159,"y":182}],"from":58,"to":56},
{"polyline":[{"x":157,"y":4069},{"x":157,"y":4091}],"from":59,"to":55},
{"polyline":[{"x":8,"y":263},{"x":8,"y":4091}],"from":56,"to":55},
{"polyline":[{"x":59,"y":4046},{"x":59,"y":4091}],"from":54,"to":55},
{"polyline":[{"x":221,"y":218},{"x":190,"y":218},{"x":190,"y":2114},{"x":127,"y":2114},{"x":127,"y":4091}],"from":58,"to":55},
{"polyline":[{"x":323,"y":110},{"x":323,"y":137},{"x":194,"y":137},{"x":194,"y":2129},{"x":127,"y":2129},{"x":127,"y":4091}],"from":57,"to":55}
]}],
"rectangles":[
{"left":0,"right":168,"top":0,"bottom":200},
{"left":0,"right":168,"top":0,"bottom":200},
{"left":0,"right":141,"top":0,"bottom":136},
{"left":0,"right":210,"top":0,"bottom":152},
{"left":0,"right":147,"top":0,"bottom":104},
{"left":0,"right":120,"top":0,"bottom":104},
{"left":0,"right":190,"top":0,"bottom":120},
{"left":0,"right":119,"top":0,"bottom":200},
{"left":0,"right":168,"top":0,"bottom":184},
{"left":0,"right":182,"top":0,"bottom":72},
{"left":0,"right":105,"top":0,"bottom":72},
{"left":0,"right":161,"top":0,"bottom":120},
{"left":0,"right":140,"top":0,"bottom":120},
{"left":0,"right":175,"top":0,"bottom":136},
{"left":0,"right":183,"top":0,"bottom":56},
{"left":0,"right":127,"top":0,"bottom":104},
{"left":0,"right":126,"top":0,"bottom":136},
{"left":0,"right":126,"top":0,"bottom":120},
{"left":0,"right":126,"top":0,"bottom":88},
{"left":0,"right":112,"top":0,"bottom":104},
{"left":0,"right":126,"top":0,"bottom":136},
{"left":0,"right":126,"top":0,"bottom":152},
{"left":0,"right":190,"top":0,"bottom":152},
{"left":0,"right":182,"top":0,"bottom":200},
{"left":0,"right":126,"top":0,"bottom":88},
{"left":0,"right":147,"top":0,"bottom":120},
{"left":0,"right":140,"top":0,"bottom":120},
{"left":0,"right":168,"top":0,"bottom":136},
{"left":0,"right":168,"top":0,"bottom":120},
{"left":0,"right":126,"top":0,"bottom":184},
{"left":0,"right":147,"top":0,"bottom":104},
{"left":0,"right":126,"top":0,"bottom":120},
{"left":0,"right":133,"top":0,"bottom":120},
{"left":0,"right":175,"top":0,"bottom":88},
{"left":0,"right":126,"top":0,"bottom":136},
{"left":0,"right":133,"top":0,"bottom":136},
{"left":0,"right":85,"top":0,"bottom":56},
{"left":0,"right":154,"top":0,"bottom":104},
{"left":0,"right":168,"top":0,"bottom":88},
{"left":0,"right":105,"top":0,"bottom":104},
{"left":0,"right":168,"top":0,"bottom":136},
{"left":0,"right":126,"top":0,"bottom":104},
{"left":0,"right":154,"top":0,"bottom":104},
{"left":0,"right":154,"top":0,"bottom":104},
{"left":0,"right":147,"top":0,"bottom":168},
{"left":0,"right":175,"top":0,"bottom":88},
{"left":0,"right":105,"top":0,"bottom":152},
{"left":0,"right":77,"top":0,"bottom":56},
{"left":0,"right":140,"top":0,"bottom":88},
{"left":0,"right":141,"top":0,"bottom":72},
{"left":0,"right":126,"top":0,"bottom":104},
{"left":0,"right":141,"top":0,"bottom":136},
{"left":0,"right":155,"top":0,"bottom":120},
{"left":0,"right":175,"top":0,"bottom":136},
{"left":0,"right":98,"top":0,"bottom":72},
{"left":0,"right":161,"top":0,"bottom":120},
{"left":0,"right":154,"top":0,"bottom":104},
{"left":0,"right":183,"top":0,"bottom":104},
{"left":0,"right":127,"top":0,"bottom":72},
{"left":0,"right":211,"top":0,"bottom":104},
{"left":0,"right":98,"top":0,"bottom":72},
{"left":0,"right":119,"top":0,"bottom":88},
{"left":0,"right":133,"top":0,"bottom":104},
{"left":0,"right":98,"top":0,"bottom":72},
{"left":0,"right":190,"top":0,"bottom":56},
{"left":0,"right":204,"top":0,"bottom":56},
{"left":0,"right":203,"top":0,"bottom":104},
{"left":0,"right":112,"top":0,"bottom":88}
]}}
