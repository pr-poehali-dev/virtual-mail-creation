import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  attachments: string[];
  timestamp: Date;
  expiresIn: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('@tempmail.pro');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [autoDeleteTime, setAutoDeleteTime] = useState('60');

  const domains = [
    '@tempmail.pro',
    '@quickmail.io',
    '@securebox.net',
    '@privatemail.com',
    '@disposable.org'
  ];

  const generateEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 10);
    const newEmail = `${randomString}${selectedDomain}`;
    setGeneratedEmail(newEmail);
    toast.success('Новый адрес создан', {
      description: 'Email скопирован в буфер обмена'
    });
    navigator.clipboard.writeText(newEmail);
  };

  const addMockEmail = () => {
    const mockEmail: Email = {
      id: Date.now().toString(),
      from: 'sender@example.com',
      subject: 'Тестовое письмо',
      body: 'Это демонстрационное письмо для проверки функционала временной почты.',
      attachments: ['document.pdf'],
      timestamp: new Date(),
      expiresIn: parseInt(autoDeleteTime)
    };
    setEmails([mockEmail, ...emails]);
    toast.info('Новое письмо получено');
  };

  useEffect(() => {
    if (emails.length > 0) {
      const interval = setInterval(() => {
        setEmails(prevEmails =>
          prevEmails.map(email => ({
            ...email,
            expiresIn: Math.max(0, email.expiresIn - 1)
          })).filter(email => email.expiresIn > 0)
        );
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [emails]);

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}ч ${minutes % 60}м`;
    }
    return `${minutes}м`;
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Mail" className="text-primary-foreground" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">TempMail Pro</h1>
                <p className="text-xs text-muted-foreground">Профессиональная временная почта</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => setActiveTab('api')}>
              <Icon name="Code" className="mr-2" size={18} />
              API Документация
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Icon name="Inbox" size={18} />
              Входящие
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Icon name="FileCode" size={18} />
              API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="animate-fade-in">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <Card className="p-6">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Создать временный адрес</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Домен</label>
                      <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {domains.map(domain => (
                            <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Автоудаление через</label>
                      <Select value={autoDeleteTime} onValueChange={setAutoDeleteTime}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 минут</SelectItem>
                          <SelectItem value="30">30 минут</SelectItem>
                          <SelectItem value="60">1 час</SelectItem>
                          <SelectItem value="180">3 часа</SelectItem>
                          <SelectItem value="360">6 часов</SelectItem>
                          <SelectItem value="1440">24 часа</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button onClick={generateEmail} className="w-full" size="lg">
                      <Icon name="Plus" className="mr-2" size={18} />
                      Создать адрес
                    </Button>

                    {generatedEmail && (
                      <div className="p-4 bg-muted rounded-lg border border-border animate-fade-in">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground">Ваш адрес</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(generatedEmail);
                              toast.success('Скопировано');
                            }}
                          >
                            <Icon name="Copy" size={14} />
                          </Button>
                        </div>
                        <code className="text-sm font-mono text-foreground break-all">{generatedEmail}</code>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      onClick={addMockEmail} 
                      className="w-full"
                      disabled={!generatedEmail}
                    >
                      <Icon name="TestTube" className="mr-2" size={18} />
                      Тестовое письмо
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon name="ShieldCheck" className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Безопасность данных</h4>
                      <p className="text-xs text-muted-foreground">Все письма автоматически удаляются. Мы не храним персональные данные.</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Card className="h-[600px] flex flex-col">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">
                        Входящие ({emails.length})
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        <Icon name="Clock" className="mr-1" size={12} />
                        Автоудаление активно
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    {emails.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                          <Icon name="Inbox" className="text-muted-foreground" size={32} />
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-2">Нет писем</h4>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          Создайте временный адрес и используйте его для регистрации. Письма появятся здесь автоматически.
                        </p>
                      </div>
                    ) : selectedEmail ? (
                      <div className="h-full flex flex-col">
                        <div className="p-6 border-b border-border">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedEmail(null)}
                            className="mb-4"
                          >
                            <Icon name="ArrowLeft" className="mr-2" size={16} />
                            Назад
                          </Button>
                          <h4 className="text-lg font-semibold text-foreground mb-2">{selectedEmail.subject}</h4>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="User" size={14} />
                              {selectedEmail.from}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Clock" size={14} />
                              {selectedEmail.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <Badge variant="destructive" className="text-xs">
                              Удаление через {formatTime(selectedEmail.expiresIn)}
                            </Badge>
                          </div>
                        </div>
                        <ScrollArea className="flex-1 p-6">
                          <p className="text-sm text-foreground whitespace-pre-wrap">{selectedEmail.body}</p>
                          {selectedEmail.attachments.length > 0 && (
                            <>
                              <Separator className="my-4" />
                              <div className="space-y-2">
                                <h5 className="text-xs font-semibold text-muted-foreground">Вложения</h5>
                                {selectedEmail.attachments.map((attachment, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <Icon name="Paperclip" className="text-muted-foreground" size={16} />
                                    <span className="text-sm text-foreground flex-1">{attachment}</span>
                                    <Button variant="ghost" size="sm">
                                      <Icon name="Download" size={16} />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </ScrollArea>
                      </div>
                    ) : (
                      <ScrollArea className="h-full">
                        {emails.map((email) => (
                          <div
                            key={email.id}
                            onClick={() => setSelectedEmail(email)}
                            className="p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-foreground truncate">{email.subject}</h4>
                                <p className="text-xs text-muted-foreground truncate">{email.from}</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {email.attachments.length > 0 && (
                                  <Icon name="Paperclip" className="text-muted-foreground" size={14} />
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {email.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{email.body}</p>
                            <Badge variant="outline" className="text-xs">
                              <Icon name="Timer" className="mr-1" size={10} />
                              {formatTime(email.expiresIn)}
                            </Badge>
                          </div>
                        ))}
                      </ScrollArea>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shrink-0">
                    <Icon name="Code" className="text-primary-foreground" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">REST API Документация</h2>
                    <p className="text-sm text-muted-foreground">
                      Интегрируйте временную почту в ваши сервисы через простой REST API
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Базовый URL</h3>
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <code className="text-sm font-mono text-foreground">https://api.tempmail.pro/v1</code>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Аутентификация</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Все запросы требуют API ключ в заголовке:
                    </p>
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <code className="text-sm font-mono text-foreground">X-Api-Key: your_api_key_here</code>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-green-500">POST</Badge>
                        <code className="text-sm font-mono text-foreground">/email/create</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Создать новый временный email адрес</p>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Параметры запроса:</p>
                        <div className="p-4 bg-muted rounded-lg border border-border">
                          <pre className="text-xs font-mono text-foreground overflow-x-auto">
{`{
  "domain": "@tempmail.pro",
  "autoDeleteMinutes": 60
}`}
                          </pre>
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground">Ответ:</p>
                        <div className="p-4 bg-muted rounded-lg border border-border">
                          <pre className="text-xs font-mono text-foreground overflow-x-auto">
{`{
  "email": "abc123@tempmail.pro",
  "expiresAt": "2024-01-01T15:00:00Z",
  "token": "inbox_token_here"
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-500">GET</Badge>
                        <code className="text-sm font-mono text-foreground">/email/:token/inbox</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Получить список входящих писем</p>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Ответ:</p>
                        <div className="p-4 bg-muted rounded-lg border border-border">
                          <pre className="text-xs font-mono text-foreground overflow-x-auto">
{`{
  "emails": [
    {
      "id": "msg_123",
      "from": "sender@example.com",
      "subject": "Welcome",
      "timestamp": "2024-01-01T14:30:00Z",
      "hasAttachments": true
    }
  ]
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-blue-500">GET</Badge>
                        <code className="text-sm font-mono text-foreground">/email/:token/message/:id</code>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">Получить полное содержимое письма</p>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground">Ответ:</p>
                        <div className="p-4 bg-muted rounded-lg border border-border">
                          <pre className="text-xs font-mono text-foreground overflow-x-auto">
{`{
  "id": "msg_123",
  "from": "sender@example.com",
  "subject": "Welcome",
  "body": "Email body text...",
  "attachments": [
    {
      "filename": "document.pdf",
      "size": 102400,
      "url": "https://..."
    }
  ]
}`}
                          </pre>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-orange-500">DELETE</Badge>
                        <code className="text-sm font-mono text-foreground">/email/:token</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Удалить временный адрес и все письма</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Webhooks</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Получайте уведомления о новых письмах в реальном времени через webhook:
                    </p>
                    <div className="p-4 bg-muted rounded-lg border border-border">
                      <pre className="text-xs font-mono text-foreground overflow-x-auto">
{`POST https://your-domain.com/webhook
{
  "event": "email.received",
  "email": "abc123@tempmail.pro",
  "messageId": "msg_123"
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Icon name="Info" className="text-primary shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">Ограничения API</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Максимум 100 запросов в минуту</li>
                          <li>• Размер вложений до 25 МБ</li>
                          <li>• Срок хранения писем до 24 часов</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2024 TempMail Pro. Профессиональная временная почта для бизнеса.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Условия использования</a>
              <a href="#" className="hover:text-foreground transition-colors">Политика конфиденциальности</a>
              <a href="#" className="hover:text-foreground transition-colors">Поддержка</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
