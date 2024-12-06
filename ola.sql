INSERT INTO diagram(iddiagram, title) VALUES (1, 'Ola');

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

INSERT INTO box(idbox, title) VALUES (31, 'DOS_LIEN');
INSERT INTO field(name, idbox) VALUES
	('code', 31),
	('pere_id', 31),
	('fils_id', 31),
	('cre_date', 31),
	('cre_utilisateur', 31);

INSERT INTO box(idbox, title) VALUES (32, 'DOS_ETAPE_DELAI');
INSERT INTO field(name, idbox) VALUES
	('etape_id', 32),
	('delai_code', 32),
	('delai_date', 32),
	('motif_valeur', 32),
	('cre_date', 32),
	('cre_utilisateur', 32);

INSERT INTO box(idbox, title) VALUES (33, 'DOS_INTERVENANT');
INSERT INTO field(name, idbox) VALUES
	('id', 33),
	('dossier_id', 33),
	('nationalite_code', 33),
	('adresse_reprise', 33),
	('cre_date', 33),
	('cre_utilisateur', 33);

INSERT INTO box(idbox, title) VALUES (34, 'DOS_INSCRIPTION');
INSERT INTO field(name, idbox) VALUES
	('id', 34),
	('acte_id', 34),
	('dossier_inscription_id', 34),
	('inscription_numero', 34);

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
	('code', 61);

INSERT INTO box(idbox, title) VALUES (62, 'FAC_ELEC_TMP');
INSERT INTO field(name, idbox) VALUES
	('facture_id', 62),
	('valo_id', 62),
	('nom_colonne', 62),
	('valeur', 62);

INSERT INTO box(idbox, title) VALUES (63, 'TRF_LIGNE');
INSERT INTO field(name, idbox) VALUES
	('tarif_id', 63),
	('type_code', 63),
	('modalite_code', 63),
	('ligne_numero', 63),
	('montant', 63);

INSERT INTO box(idbox, title) VALUES (64, 'DOS_CLASSE');
INSERT INTO field(name, idbox) VALUES
	('ID', 64),
	('DOSSIER_ID', 64),
	('CLASSE_CODE', 64);

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
	('TITRE_VALEUR', 68);

WITH cte(box_title, field_name, val) AS (
 	SELECT 'FAC_COMPTABLE','type_code','avoir' UNION ALL
 	SELECT 'FAC_COMPTABLE','type_code','facture' UNION ALL
 	SELECT 'FAC_COMPTABLE','dossier_id','annuit' UNION ALL
 	SELECT 'FAC_COMPTABLE','dossier_id','proced' UNION ALL
 	SELECT 'DOS_NOTE','dossier_id','agent' UNION ALL
 	SELECT 'DOS_NOTE','dossier_id','image' UNION ALL
 	SELECT 'DOS_NOTE','dossier_id','status' UNION ALL
 	SELECT 'TIE_HISTORIQUE','id','adress' UNION ALL
 	SELECT 'TIE_HISTORIQUE','id','note' UNION ALL
 	SELECT 'TIE_HISTORIQUE','id','portef' UNION ALL
 	SELECT 'TIE_HISTORIQUE','id','raisoc' UNION ALL
 	SELECT 'TIE_HISTORIQUE','id','tiers' UNION ALL
 	SELECT 'TIE_HISTORIQUE','id','type' UNION ALL
 	SELECT 'TIE_HISTORIQUE','action_code','ajout' UNION ALL
 	SELECT 'TIE_HISTORIQUE','action_code','modif' UNION ALL
 	SELECT 'TIE_HISTORIQUE','action_code','suppr' UNION ALL
 	SELECT 'DOS_RESPONSABLE','dossier_id','admtra' UNION ALL
 	SELECT 'DOS_RESPONSABLE','dossier_id','ingen' UNION ALL
 	SELECT 'DOS_RESPONSABLE','dossier_id','ingres' UNION ALL
 	SELECT 'DOS_RESPONSABLE','dossier_id','ingtra' UNION ALL
 	SELECT 'DOS_RESPONSABLE','dossier_id','resadm' UNION ALL
 	SELECT 'DOS_ACTE_DATE','acte_id','acte' UNION ALL
 	SELECT 'DOS_ACTE','acte_code','cessio' UNION ALL
 	SELECT 'DOS_ACTE','acte_code','chgrs' UNION ALL
 	SELECT 'DOS_ACTE','acte_code','dep' UNION ALL
 	SELECT 'FAC_FACTURE','facture_code','annuit' UNION ALL
 	SELECT 'FAC_FACTURE','facture_code','proced' UNION ALL
 	SELECT 'DOS_ANNUITE_DATE','annuite_id','facann' UNION ALL
 	SELECT 'DOS_ANNUITE_DATE','annuite_id','orclan' UNION ALL
 	SELECT 'DOS_ANNUITE_DATE','annuite_id','relann' UNION ALL
 	SELECT 'DOS_ETAPE_DELAI_HISTORIQUE','delai_code','client' UNION ALL
 	SELECT 'DOS_ETAPE_DELAI_HISTORIQUE','delai_code','derdel' UNION ALL
 	SELECT 'DOS_ETAPE_DELAI_HISTORIQUE','delai_code','intern' UNION ALL
 	SELECT 'DOS_ETAPE_DELAI_HISTORIQUE','delai_code','offici' UNION ALL
 	SELECT 'FAC_COMMENTAIRE_LIGNE','commentaire_id','commen' UNION ALL
 	SELECT 'FAC_COMMENTAIRE_LIGNE','commentaire_id','sousto' UNION ALL
 	SELECT 'DOS_DOSSIER','service_code','brevet' UNION ALL
 	SELECT 'DOS_DOSSIER','service_code','depetr' UNION ALL
 	SELECT 'DOS_DOSSIER','service_code','sgegco' UNION ALL
 	SELECT 'DOS_ACTE_TIERS','code','ajout' UNION ALL
 	SELECT 'DOS_ACTE_TIERS','code','modif' UNION ALL
 	SELECT 'DOS_ACTE_TIERS','code','suppr' UNION ALL
 	SELECT 'TIE_COMMUNICATION','type_code','email' UNION ALL
 	SELECT 'TIE_COMMUNICATION','type_code','fax' UNION ALL
 	SELECT 'TIE_COMMUNICATION','type_code','telbur' UNION ALL
 	SELECT 'TIE_GROUPE','type_code','financ' UNION ALL
 	SELECT 'TIE_GROUPE','type_code','legal' UNION ALL
 	SELECT 'TIE_COMPTABILITE','code','client' UNION ALL
 	SELECT 'TIE_COMPTABILITE','code','fourni' UNION ALL
 	SELECT 'TIE_RESPONSABLE','responsabilite_code','admtra' UNION ALL
 	SELECT 'TIE_RESPONSABLE','responsabilite_code','associ' UNION ALL
 	SELECT 'TIE_RESPONSABLE','responsabilite_code','ingen' UNION ALL
 	SELECT 'TIE_RESPONSABLE','responsabilite_code','ingres' UNION ALL
 	SELECT 'TIE_RESPONSABLE','responsabilite_code','jurres' UNION ALL
 	SELECT 'TIE_RESPONSABLE','responsabilite_code','resadm' UNION ALL
 	SELECT 'TIE_TYPE','code','CLIDIR' UNION ALL
 	SELECT 'TIE_TYPE','code','CORCLI' UNION ALL
 	SELECT 'TIE_TYPE','code','TITU' UNION ALL
	SELECT 'PAR_GENERALITE','numerique_flag','N' UNION ALL
	SELECT 'PAR_GENERALITE','numerique_flag','O' UNION ALL
	SELECT 'TIE_NOTE','type_code','compta' UNION ALL
	SELECT 'TIE_NOTE','type_code','normal'
)
INSERT INTO values(idfield, data)
SELECT f.idfield, cte.val
FROM cte
JOIN box b ON cte.box_title=b.title
JOIN field f ON f.idbox=b.idbox AND f.name=cte.field_name;
	

WITH cte(box_title, comment) AS (
 	SELECT 'DOS_ETAPE','permet de savoir ce qu il y a de lance sur un dossier' UNION ALL
 	SELECT 'DOS_ETAPE_DETAIL','pour tous les delais passes (ceux qui ont deja ete realise sur un dossier).\\nunique(etape_id, tri_numero)'	UNION ALL
 	SELECT 'DOS_ETAPE_DELAI','pour tous les delais en cours sur un dossier.\\nunique(etape_id, delai_code)'	UNION ALL
 	SELECT 'DOS_INTERVENANT','lien entre le dossier et le ou les inventeurs'	UNION ALL
 	SELECT 'DOS_TIERS','unique(dossier_id, code, classement_numero)'	UNION ALL
 	SELECT 'DOS_ANNUITE','unique(dossier_id, qt_debut_numero)'	UNION ALL
 	SELECT 'TIE_TIERS','unique(nom_abrege)'	UNION ALL
 	SELECT 'LEG_VTQP','unique(objet_code, pays_code, voie_code, type_code, qualificatif_code, particularite_code, date_pivot_code)'	UNION ALL
 	SELECT 'COM_UTILISATEUR','unique(code)'	UNION ALL
 	SELECT 'TIE_PORTEFEUILLE','unique(libelle_long, tiers_id)\\nunique(tiers_id, tri_numero)'	UNION ALL
 	SELECT 'DOS_GENERALITE','Should have a constraint UNIQUE(DOSSIER_ID, CODE), but already has some inconsistent data.\\nDOSSIER_ID CODE\\n110677236 ssiprm\\n110677236 SSIPRM\\npreventing the late constraint creation.\\nTo speed things up in otherwise slow common table expression, had to add an index:\\nCREATE NONCLUSTERED INDEX Idx_gen_dossierid_code   \\n    ON DOS_GENERALITE(DOSSIER_ID, CODE) '	UNION ALL
 	SELECT 'COM_LIBELLE','unique(type_code, langue_code, code, ligne_numero)'	UNION ALL
 	SELECT 'TIE_CARACTERISTIQUE','unique index (contact_id, code, tiers_id)'	UNION ALL
 	SELECT 'TIE_COURRIER','unique index (portefeuille_id, objet_code, famille_code, courrier_code)'	UNION ALL
 	SELECT 'TIE_COURRIER_DETAIL','unique index (tiers_courrier_id, detail_code, adresse_id, contact_id, communication_id)'	UNION ALL
 	SELECT 'COM_PARAMETRAGE_FICHE','unique(prestation_code, pays_code, fiche_type_code, type_code, code_code)'
), cte2 AS (
	INSERT INTO message_tag(message)
	SELECT comment
	FROM cte
	RETURNING *
)
INSERT INTO graph(from_table, from_key, to_table, to_key)
SELECT 'message_tag', idmessage, 'box', b.idbox 
FROM cte
JOIN box b ON b.title = cte.box_title;

WITH cte(box_title, field_name, comment) AS (
 	SELECT 'DOS_TIERS','reference_libelle','may hold CAPEX/OPEX information on lines that have CODE=CPT.'
), cte2 AS (
	INSERT INTO message_tag(message)
	SELECT comment
	FROM cte
	RETURNING *
)
INSERT INTO graph(from_table, from_key, to_table, to_key)
SELECT 'message_tag', idmessage, 'field', f.idfield
FROM cte
JOIN box b ON b.title = cte.box_title
JOIN field f ON f.idbox=f.idbox AND f.name=cte.field_name;
	
WITH cte(idbox_from, idbox_to) AS (
	SELECT 52+1, 48+1 UNION ALL
	SELECT 52+1, 53+1 UNION ALL
	SELECT 29+1, 29+1 UNION ALL
	SELECT 55+1, 56+1 UNION ALL
	SELECT 57+1, 35+1 UNION ALL
	SELECT 58+1, 56+1 UNION ALL
	SELECT 17+1, 27+1 UNION ALL
	SELECT 16+1, 17+1 UNION ALL
	SELECT 34+1, 17+1 UNION ALL
	SELECT 34+1, 38+1 UNION ALL
	SELECT 34+1, 3+1 UNION ALL
	SELECT 24+1, 27+1 UNION ALL
	SELECT 24+1, 0+1 UNION ALL
	SELECT 21+1, 24+1 UNION ALL
	SELECT 9+1, 27+1 UNION ALL
	SELECT 25+1, 27+1 UNION ALL
	SELECT 25+1, 35+1 UNION ALL
	SELECT 1+1, 27+1 UNION ALL
	SELECT 1+1, 0+1 UNION ALL
	SELECT 54+1, 27+1 UNION ALL
	SELECT 27+1, 44+1 UNION ALL
	SELECT 0+1, 27+1 UNION ALL
	SELECT 0+1, 0+1 UNION ALL
	SELECT 0+1, 29+1 UNION ALL
	SELECT 31+1, 0+1 UNION ALL
	SELECT 22+1, 0+1 UNION ALL
	SELECT 45+1, 0+1 UNION ALL
	SELECT 26+1, 27+1 UNION ALL
	SELECT 33+1, 17+1 UNION ALL
	SELECT 32+1, 27+1 UNION ALL
	SELECT 30+1, 27+1 UNION ALL
	SELECT 30+1, 27+1 UNION ALL
	SELECT 10+1, 27+1 UNION ALL
	SELECT 13+1, 27+1 UNION ALL
	SELECT 13+1, 29+1 UNION ALL
	SELECT 3+1, 27+1 UNION ALL
	SELECT 3+1, 35+1 UNION ALL
	SELECT 28+1, 27+1 UNION ALL
	SELECT 23+1, 23+1 UNION ALL
	SELECT 23+1, 0+1 UNION ALL
	SELECT 23+1, 19+1 UNION ALL
	SELECT 7+1, 18+1 UNION ALL
	SELECT 7+1, 19+1 UNION ALL
	SELECT 7+1, 35+1 UNION ALL
	SELECT 2+1, 7+1 UNION ALL
	SELECT 6+1, 2+1 UNION ALL
	SELECT 18+1, 18+1 UNION ALL
	SELECT 18+1, 19+1 UNION ALL
	SELECT 19+1, 35+1 UNION ALL
	SELECT 14+1, 18+1 UNION ALL
	SELECT 14+1, 15+1 UNION ALL
	SELECT 15+1, 19+1 UNION ALL
	SELECT 20+1, 18+1 UNION ALL
	SELECT 20+1, 0+1 UNION ALL
	SELECT 20+1, 35+1 UNION ALL
	SELECT 11+1, 19+1 UNION ALL
	SELECT 8+1, 21+1 UNION ALL
	SELECT 8+1, 18+1 UNION ALL
	SELECT 8+1, 0+1 UNION ALL
	SELECT 8+1, 35+1 UNION ALL
	SELECT 48+1, 26+1 UNION ALL
	SELECT 36+1, 35+1 UNION ALL
	SELECT 49+1, 40+1 UNION ALL
	SELECT 49+1, 35+1 UNION ALL
	SELECT 37+1, 36+1 UNION ALL
	SELECT 37+1, 40+1 UNION ALL
	SELECT 42+1, 35+1 UNION ALL
	SELECT 40+1, 36+1 UNION ALL
	SELECT 40+1, 36+1 UNION ALL
	SELECT 40+1, 35+1 UNION ALL
	SELECT 50+1, 5+1 UNION ALL
	SELECT 51+1, 36+1 UNION ALL
	SELECT 51+1, 40+1 UNION ALL
	SELECT 51+1, 50+1 UNION ALL
	SELECT 4+1, 5+1 UNION ALL
	SELECT 41+1, 35+1 UNION ALL
	SELECT 12+1, 35+1 UNION ALL
	SELECT 39+1, 35+1 UNION ALL
	SELECT 5+1, 35+1 UNION ALL
	SELECT 38+1, 35+1 UNION ALL
	SELECT 43+1, 35+1 UNION ALL
	SELECT 43+1, 29+1 UNION ALL
	SELECT 47+1, 35+1 UNION ALL
	SELECT 59+1, 55+1 UNION ALL
	SELECT 8+1, 19+1 UNION ALL
	SELECT 8+1, 60+1 UNION ALL
	SELECT 61+1, 19+1 UNION ALL
	SELECT 61+1, 8+1 UNION ALL
	SELECT 8+1, 29+1 UNION ALL
	SELECT 62+1, 60+1 UNION ALL
	SELECT 27+1, 55+1 UNION ALL
	SELECT 63+1, 27+1 UNION ALL
	SELECT 56+1, 55+1 UNION ALL
	SELECT 54+1, 55+1 UNION ALL
	SELECT 58+1, 55+1 UNION ALL
	SELECT 57+1, 55+1 UNION ALL
	SELECT 64+1, 19+1 UNION ALL
	SELECT 65+1, 8+1 UNION ALL
	SELECT 66+1, 35+1 UNION ALL
	SELECT 65+1, 66+1 UNION ALL
	SELECT 67+1, 27+1
)
INSERT INTO links(idbox_from, idbox_to)
SELECT idbox_from, idbox_to
FROM cte;

WITH cte(box_title, field_name, color) AS (
	SELECT 'COM_LIBELLE','code','yellow' UNION ALL
	SELECT 'COM_LIBELLE','type_code','yellow' UNION ALL
	SELECT 'TIE_TYPE','code','yellow' UNION ALL
	SELECT 'TIE_COMPTABILITE','code','yellow' UNION ALL
	SELECT 'TIE_HISTORIQUE','action_code','yellow' UNION ALL
	SELECT 'TIE_HISTORIQUE','rubrique_code','yellow' UNION ALL
	SELECT 'TIE_RAISON_SOCIALE','id','red' UNION ALL
	SELECT 'TIE_RAISON_SOCIALE','pays_code','yellow' UNION ALL
	SELECT 'TIE_TIERS','id','skyblue' UNION ALL
	SELECT 'TIE_RESPONSABLE','responsabilite_code','yellow' UNION ALL
	SELECT 'COM_UTILISATEUR','id','pink' UNION ALL
	SELECT 'COM_UTILISATEUR','code','yellow' UNION ALL
	SELECT 'TIE_CRITERE','critere_code','yellow' UNION ALL
	SELECT 'TIE_COMMUNICATION','type_code','yellow' UNION ALL
	SELECT 'TIE_CONTACT','contact_code','yellow' UNION ALL
	SELECT 'FAC_TITRE','langue_code','yellow' UNION ALL
	SELECT 'FAC_TITRE','poste_code','yellow' UNION ALL
	SELECT 'FAC_FACTURE_DOSSIER_TRACE','dossier_id','palegreen' UNION ALL
	SELECT 'FAC_FACTURE','facture_code','yellow' UNION ALL
	SELECT 'FAC_FACTURE','tiers_id','skyblue' UNION ALL
	SELECT 'FAC_COMMENTAIRE_LIGNE','etape_id','olive' UNION ALL
	SELECT 'FAC_COMMENTAIRE_LIGNE','ligne_code','yellow' UNION ALL
	SELECT 'FAC_COMMENTAIRE_LIGNE','ligne_numero','yellow' UNION ALL
	SELECT 'FAC_COMMENTAIRE_LIGNE','poste_code','yellow' UNION ALL
	SELECT 'FAC_COMMENTAIRE_LIGNE','poste_presentation_code','yellow' UNION ALL
	SELECT 'FAC_INTERVENANT','dossier_id','palegreen' UNION ALL
	SELECT 'FAC_INTERVENANT','tiers_id','skyblue' UNION ALL
	SELECT 'FAC_INTERVENANT','etape_id','olive' UNION ALL
	SELECT 'FAC_DOSSIER','dossier_id','palegreen' UNION ALL
	SELECT 'FAC_COMPTABLE','type_code','yellow' UNION ALL
	SELECT 'FAC_COMPTABLE','dossier_id','palegreen' UNION ALL
	SELECT 'FAC_COMPTABLE','tiers_id','skyblue' UNION ALL
	SELECT 'FAC_COMPTABLE','facture_code','yellow' UNION ALL
	SELECT 'FAC_COMPTABLE_LIGNE_DETAIL','poste_code','yellow' UNION ALL
	SELECT 'FAC_COMPTABLE_LIGNE_DETAIL','ligne_code','yellow' UNION ALL
	SELECT 'FAC_COMPTABLE_LIGNE','poste_code','yellow' UNION ALL
	SELECT 'FAC_COMPTABLE_LIGNE','ligne_code','yellow' UNION ALL
	SELECT 'DOS_ANNUITE_DATE','annuite_id','olive' UNION ALL
	SELECT 'DOS_ANNUITE_DATE','date_date','yellow' UNION ALL
	SELECT 'FAC_VALORISATION_TIERS','dossier_id','palegreen' UNION ALL
	SELECT 'FAC_VALORISATION_TIERS','tiers_id','skyblue' UNION ALL
	SELECT 'FAC_VALORISATION_TIERS','etape_id','olive' UNION ALL
	SELECT 'DOS_INTERVENANT','nationalite_code','yellow' UNION ALL
	SELECT 'DOS_GENERALITE','code','yellow' UNION ALL
	SELECT 'DOS_CRITERE','tiers_id','skyblue' UNION ALL
	SELECT 'DOS_CRITERE','code','yellow' UNION ALL
	SELECT 'DOS_TITRE','langue_code','yellow' UNION ALL
	SELECT 'DOS_TIERS','code','yellow' UNION ALL
	SELECT 'DOS_TIERS','tiers_id','skyblue' UNION ALL
	SELECT 'DOS_CARACTERISTIQUE','caracteristique_code','yellow' UNION ALL
	SELECT 'DOS_LIEN','code','yellow' UNION ALL
	SELECT 'DOS_DOSSIER','id','palegreen' UNION ALL
	SELECT 'DOS_DOSSIER','service_code','yellow' UNION ALL
	SELECT 'DOS_DOSSIER','vtqp_id','orange' UNION ALL
	SELECT 'DOS_ANNUITE','id','grey' UNION ALL
	SELECT 'DOS_ETAPE_DELAI','delai_code','yellow' UNION ALL
	SELECT 'DOS_RESPONSABLE','responsabilite_code','yellow' UNION ALL
	SELECT 'DOS_RESPONSABLE','responsable_id','hotpink' UNION ALL
	SELECT 'LEG_VTQP','id','orange' UNION ALL
	SELECT 'LEG_VTQP','pays_code','yellow' UNION ALL
	SELECT 'LEG_VTQP','type_code','yellow' UNION ALL
	SELECT 'DOS_DATE','code','yellow' UNION ALL
	SELECT 'DOS_ETAPE','etape_code','yellow' UNION ALL
	SELECT 'DOS_ETAPE','responsable_id','hotpink' UNION ALL
	SELECT 'DOS_ETAPE','service_code','yellow' UNION ALL
	SELECT 'DOS_ETAPE_DETAIL','action_type_code','yellow' UNION ALL
	SELECT 'DOS_ETAPE_DELAI_HISTORIQUE','delai_code','yellow' UNION ALL
	SELECT 'COM_LIBELLE','langue_code','yellow' UNION ALL
	SELECT 'COM_LIBELLE','ligne_numero','yellow' UNION ALL
	SELECT 'DOS_ACTE','dossier_id','palegreen' UNION ALL
	SELECT 'DOS_ACTE','acte_code','yellow' UNION ALL
	SELECT 'DOS_ACTE_TIERS','raison_id','red' UNION ALL
	SELECT 'DOS_ACTE_TIERS','tiers_id','skyblue' UNION ALL
	SELECT 'DOS_ACTE_TIERS','code','yellow' UNION ALL
	SELECT 'DOS_ACTE_DATE','date_code','yellow' UNION ALL
	SELECT 'DOS_ETAPE','id','olive' UNION ALL
	SELECT 'TIE_CARACTERISTIQUE','code','yellow' UNION ALL
	SELECT 'PAR_GENERALITE','code','yellow' UNION ALL
	SELECT 'DOS_GENERALITE','generalite_code','yellow' UNION ALL
	SELECT 'PAR_GENERALITE','type_libelle_code','yellow' UNION ALL
	SELECT 'TIE_COURRIER','objet_code','yellow' UNION ALL
	SELECT 'TIE_COURRIER','famille_code','yellow' UNION ALL
	SELECT 'TIE_COURRIER','courrier_code','yellow' UNION ALL
	SELECT 'TIE_COURRIER_DETAIL','detail_code','yellow' UNION ALL
	SELECT 'TIE_COURRIER_DETAIL','langue_code','yellow' UNION ALL
	SELECT 'TIE_COURRIER_DETAIL','format_code','yellow' UNION ALL
	SELECT 'TIE_COURRIER_DETAIL','type_code','yellow' UNION ALL
	SELECT 'COM_PARAMETRAGE_FICHE','prestation_code','yellow' UNION ALL
	SELECT 'COM_PARAMETRAGE_FICHE','pays_code','yellow' UNION ALL
	SELECT 'COM_PARAMETRAGE_FICHE','fiche_type_code','yellow' UNION ALL
	SELECT 'COM_PARAMETRAGE_FICHE','code_code','yellow' UNION ALL
	SELECT 'COM_PARAMETRAGE_FICHE','type_code','yellow' UNION ALL
	SELECT 'PRE_PRESTATION','code','yellow' UNION ALL
	SELECT 'PRE_PRESTATION','objet_code','yellow' UNION ALL
	SELECT 'PRE_PRESTATION','service_code','yellow' UNION ALL
	SELECT 'PRE_PRESTATION','nouv_dos_etape_code','yellow' UNION ALL
	SELECT 'PAR_GENERALITE','objet_code','yellow' UNION ALL
	SELECT 'TRF_TARIF','code','yellow'
)
INSERT INTO graph(from_table, from_key, to_table, to_key)
SELECT 'tag', t.idtag, 'field', f.idfield
FROM cte
JOIN tag t ON t.type_code='COLOR' AND t.code=cte.color
JOIN box b ON b.title = cte.box_title
JOIN field f ON f.idbox = f.idbox AND f.name = cte.field_name;
