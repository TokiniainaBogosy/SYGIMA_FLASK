import React from "react";
import { computeDemandeStats } from "../utils/computeDemandeStats";

export default function DashboardReportPdf({ user, demandes, logoUrl,periode }) {
  const today = new Date().toLocaleString("fr-FR");
  const { total, enCours, approuvees, rejetees, taux } = computeDemandeStats(demandes, periode);

  return (
    <div
      style={{
        width: "794px",           // ~ A4 en px à 96dpi
        padding: "32px",
        background: "white",
        color: "#111827",
        fontFamily: "Arial",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ width: 56, height: 56, objectFit: "contain" }}
            />
          )}
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Rapport Dashboard</div>
            <div style={{ fontSize: 12, color: "#6B7280" }}>Généré le {today}</div>
          </div>
        </div>

        <div style={{ textAlign: "right", fontSize: 12, color: "#374151" }}>
          <div><b>Utilisateur:</b> {user?.prenom} {user?.nom}</div>
          <div><b>Email:</b> {user?.email}</div>
          <div><b>Rôle:</b> {String(user?.role)}</div>
          <div><b>Département ID:</b> {user?.departement_id}</div>
        </div>
      </div>

      <hr style={{ margin: "18px 0", borderColor: "#E5E7EB" }} />

      {/* Stats */}
       <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
      <StatBox label="Total demandes" value={total} />
      <StatBox label="En attente" value={enCours} />
      <StatBox label="Approuvées" value={approuvees} />
      <StatBox label="Rejetées" value={rejetees} />
      <StatBox label="Taux approbation" value={`${taux}%`} />
    </div>
      
        
      {/* Table */}
      <div style={{ marginTop: 18 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Dernières demandes</div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: "#F3F4F6" }}>
              {["Référence", "Demandeur", "Département", "Matériel", "Statut", "Date"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "8px",
                    border: "1px solid #E5E7EB",
                    fontWeight: 700,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {(demandes || []).slice(0, 50).map((d, idx) => (
              <tr key={idx}>
                <Td>{d.reference}</Td>
                <Td>{d.demandeur}</Td>
                <Td>{d.departement}</Td>
                <Td>{d.materiels}</Td>
                <Td>{d.statut}</Td>
                <Td>{d.date}</Td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: 8, fontSize: 10, color: "#6B7280" }}>
          Affichage limité à 20 lignes dans le PDF.
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: 10, padding: 12 }}>
      <div style={{ fontSize: 11, color: "#6B7280" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Td({ children }) {
  return (
    <td style={{ padding: "7px 8px", border: "1px solid #E5E7EB", verticalAlign: "top" }}>
      {children ?? "-"}
    </td>
  );
}