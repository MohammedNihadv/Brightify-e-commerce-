def get_otp_email_html(code):
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Brightify Verification</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');
            body {{
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
                background-color: #0f172a;
            }}
            table, td {{
                border-collapse: collapse;
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
            }}
            img {{
                border: 0;
                height: auto;
                line-height: 100%;
                outline: none;
                text-decoration: none;
            }}
            .fluid-container {{
                max-width: 600px !important;
                width: 100% !important;
            }}
            @media screen and (max-width: 600px) {{
                .card {{
                    padding: 30px 20px !important;
                    border-radius: 16px !important;
                }}
                .code {{
                    font-size: 32px !important;
                    letter-spacing: 4px !important;
                    padding: 20px !important;
                }}
                .logo {{
                    font-size: 24px !important;
                }}
                h2 {{
                    font-size: 20px !important;
                }}
            }}
            @media screen and (max-width: 400px) {{
                .code {{
                    font-size: 28px !important;
                    letter-spacing: 2px !important;
                }}
            }}
        </style>
    </head>
    <body style="background-color: #0f172a; font-family: 'Inter', Arial, sans-serif; color: #ffffff;">
        <center>
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0f172a;">
                <tr>
                    <td align="center" style="padding: 40px 10px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="fluid-container" style="max-width: 600px; width: 100%;">
                            <tr>
                                <td align="center" style="background-color: #1e293b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 48px;" class="card">
                                    <h1 class="logo" style="color: #2dd4bf; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">BRIGHTIFY</h1>
                                    <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 40px 0; letter-spacing: 2px;">PREMIUM LIGHTING SOLUTIONS</p>
                                    
                                    <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0 0 16px 0;">Sign In Verification</h2>
                                    <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Your secure verification code is below. Enter this code to access your account.</p>
                                    
                                    <div style="background-color: rgba(45, 212, 191, 0.05); border: 2px dashed #2dd4bf; border-radius: 16px; padding: 30px; margin: 32px 0;">
                                        <p class="code" style="font-size: 48px; font-weight: 800; color: #2dd4bf; letter-spacing: 8px; margin: 0; text-align: center;">{code}</p>
                                    </div>
                                    
                                    <p style="color: #94a3b8; font-size: 14px; margin: 32px 0 0 0;">This code will expire in <span style="color: #38bdf8; font-weight: 600;">10 minutes</span>.</p>
                                    <p style="color: #64748b; font-size: 12px; margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px;">
                                        © 2026 Brightify. All rights reserved.<br>
                                        Premium Lighting Solutions for the Modern Home.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    </html>
    """
